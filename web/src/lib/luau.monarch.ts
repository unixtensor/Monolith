// Generated using Claude Opus 5.5 with max effort on 9/23/26.
// Manually reviewed and modified by unixtensor.
/**
 * Luau language support for the Monaco editor.
 *
 * Converted from `Luau.YAML-tmLanguage` (source.luau, JohnnyMorganz/Luau.tmLanguage)
 * into Monarch — Monaco's own tokenizer format — plus the surrounding pieces that
 * a TextMate grammar alone does not provide: a language configuration, a matching
 * colour theme and a completion provider.
 *
 *   import { registerLuau } from './luau';
 *   import * as monaco from 'monaco-editor';
 *
 *   registerLuau(monaco);
 *   monaco.editor.create(el, { value: src, language: 'luau', theme: 'luau-dark' });
 *
 * The only dependency is `monaco-editor` itself, and only for types: every import
 * in this file is `import type`, so nothing is pulled in at runtime and the file
 * works just as well against the AMD/global `monaco` object.
 *
 * ---------------------------------------------------------------------------
 * Notes on the conversion
 * ---------------------------------------------------------------------------
 * Monarch is a line-oriented state machine, not a scope stack, so a few TextMate
 * constructs have no direct equivalent:
 *
 *  - Lookbehind. Monarch matches each rule against the *rest of the line* only
 *    (`line.substr(pos)`), so a lookbehind such as `(?<![^.]\.|:)` can never see
 *    the preceding text. Every such rule is instead expressed positionally: the
 *    `.`/`:` and the name that follows it are matched together, which gives the
 *    same result (`math.floor` is a library call, `foo.math.floor` is not).
 *
 *  - Grammar-wide `end` patterns. A TextMate `begin`/`end` pair unwinds anything
 *    nested inside it when it ends; a Monarch state can only pop itself. Type
 *    annotations therefore end explicitly — on `=`, `;`, `,`, a closing bracket,
 *    an expression-only operator, a statement keyword, or the end of the line —
 *    mirroring the `lookAheadEndOfType` variable in the original grammar.
 *    Declarations (`local`, `const`, `for`, `function`, `type`) additionally pop
 *    at the start of the next line, so an unfinished line being typed cannot
 *    recolour the rest of the file.
 *
 *  - Embedded ```luau code fences inside block comments. The original grammar
 *    re-enters `source.luau` for them through a `while` rule. That is the one
 *    feature deliberately left out: without TextMate's unwinding, an unclosed
 *    string or bracket inside a fence would leak into the rest of the document.
 *    Fenced blocks stay comment-coloured.
 *
 *  - Scope inheritance. A character no TextMate rule scopes keeps the scope of
 *    the rule it sits inside, so the `:` of `` `{item:upper()}` `` is coloured
 *    as string text. Monarch has no inheritance and tokenizes it on its own
 *    (`delimiter`).
 *
 * There is also one deliberate difference: the grammar's two metamethod lists
 * disagree about `__iter`/`__idiv` (see `LUAU_METAMETHODS`), and this file uses
 * the longer one in both places.
 *
 * The conversion was checked by running `vscode-textmate` with the original
 * grammar and Monaco's Monarch engine with this file over the same Luau
 * sources, and comparing the result character by character.
 *
 * Token names are Monaco's, not TextMate's, and are hierarchical: a theme that
 * knows nothing about Luau still matches on the leading segment (`keyword`,
 * `string`, `variable`, `type`, ...), while `luau-dark`/`luau-light` below style
 * the full names. The mapping from the original scopes is given in the tokenizer.
 */

import type { IDisposable, editor, languages } from "monaco-editor";

type Monaco = typeof import("monaco-editor");

/* ========================================================================== *
 * 1. Language data
 *
 * Single source of truth: the tokenizer regexes and the completion items are
 * both generated from these lists, so anything that completes also highlights.
 * The contents are exactly the ones listed in the TextMate grammar.
 * ========================================================================== */

/** `break`, `do`, ... — `keyword.control.luau` in the grammar. */
export const LUAU_CONTROL_KEYWORDS = [
	"break",
	"continue",
	"do",
	"else",
	"elseif",
	"end",
	"for",
	"function",
	"if",
	"in",
	"repeat",
	"return",
	"then",
	"until",
	"while",
];

/** `storage.modifier.*` — `export` and `type` are contextual and handled by rules. */
export const LUAU_STORAGE_KEYWORDS = ["local", "const"];

/** `and`/`or`/`not` — `keyword.operator.logical keyword.operator.wordlike`. */
export const LUAU_WORD_OPERATORS = ["and", "or", "not"];

/** Everything a completion list should offer as a bare keyword. */
export const LUAU_ALL_KEYWORDS = [
	...LUAU_CONTROL_KEYWORDS,
	...LUAU_STORAGE_KEYWORDS,
	...LUAU_WORD_OPERATORS,
	"export",
	"type",
	"nil",
	"true",
	"false",
	"self",
];

/**
 * Metamethod names, highlighted after a `.` or `:`.
 *
 * The grammar keeps two copies of this list and they disagree: the one used for
 * function definitions has `__iter` and `__idiv`, the one used for member access
 * does not, so `function t.__iter()` is highlighted there but `t.__iter` is not.
 * They are unified here — both are real Luau metamethods. This is the one place
 * this file deliberately differs from the grammar on otherwise valid code.
 */
export const LUAU_METAMETHODS = [
	"__add",
	"__call",
	"__concat",
	"__div",
	"__eq",
	"__idiv",
	"__index",
	"__iter",
	"__le",
	"__len",
	"__lt",
	"__metatable",
	"__mod",
	"__mode",
	"__mul",
	"__newindex",
	"__pow",
	"__sub",
	"__tostring",
	"__unm",
];

/** Primitive type names — `support.type.primitive.luau`. */
export const LUAU_TYPE_PRIMITIVES = [
	"any",
	"boolean",
	"buffer",
	"integer",
	"never",
	"nil",
	"number",
	"string",
	"thread",
	"unknown",
	"vector",
];

/** Global functions — `support.function.luau`. */
export const LUAU_GLOBAL_FUNCTIONS = [
	"assert",
	"collectgarbage",
	"error",
	"gcinfo",
	"getfenv",
	"getmetatable",
	"ipairs",
	"loadstring",
	"newproxy",
	"next",
	"pairs",
	"pcall",
	"print",
	"rawequal",
	"rawset",
	"require",
	"select",
	"setfenv",
	"setmetatable",
	"tonumber",
	"tostring",
	"type",
	"typeof",
	"unpack",
	"xpcall",
];

/** Global constants — `constant.language.luau`. */
export const LUAU_GLOBAL_CONSTANTS = ["_G", "_VERSION"];

/** Roblox globals the grammar treats as functions. */
export const LUAU_ROBLOX_FUNCTIONS = [
	"delay",
	"DebuggerManager",
	"elapsedTime",
	"PluginManager",
	"printidentity",
	"settings",
	"spawn",
	"stats",
	"tick",
	"time",
	"UserSettings",
	"version",
	"wait",
	"warn",
];

/** Roblox globals the grammar treats as constants (`Enum` is matched separately). */
export const LUAU_ROBLOX_CONSTANTS = [
	"game",
	"plugin",
	"shared",
	"script",
	"workspace",
];

/** Standard library namespaces and their functions — `support.function.luau`. */
export const LUAU_LIBRARIES: Record<string, string[]> = {
	bit32: [
		"arshift",
		"band",
		"bnot",
		"bor",
		"btest",
		"bxor",
		"byteswap",
		"countlz",
		"countrz",
		"extract",
		"lrotate",
		"lshift",
		"replace",
		"rrotate",
		"rshift",
	],
	buffer: [
		"copy",
		"create",
		"fill",
		"fromstring",
		"len",
		"readbits",
		"readf32",
		"readf64",
		"readi16",
		"readi32",
		"readi8",
		"readinteger",
		"readstring",
		"readu16",
		"readu32",
		"readu8",
		"tostring",
		"writebits",
		"writef32",
		"writef64",
		"writei16",
		"writei32",
		"writei8",
		"writeinteger",
		"writestring",
		"writeu16",
		"writeu32",
		"writeu8",
	],
	coroutine: [
		"close",
		"create",
		"isyieldable",
		"resume",
		"running",
		"status",
		"wrap",
		"yield",
	],
	debug: ["info", "loadmodule", "profilebegin", "profileend", "traceback"],
	integer: [
		"add",
		"arshift",
		"band",
		"bnot",
		"bor",
		"bswap",
		"btest",
		"bxor",
		"clamp",
		"countlz",
		"countrz",
		"create",
		"div",
		"extract",
		"fromstring",
		"ge",
		"gt",
		"idiv",
		"le",
		"lrotate",
		"lshift",
		"lt",
		"max",
		"min",
		"mod",
		"mul",
		"neg",
		"rem",
		"replace",
		"rrotate",
		"rshift",
		"sub",
		"tonumber",
		"udiv",
		"uge",
		"ugt",
		"ule",
		"ult",
		"urem",
	],
	math: [
		"abs",
		"acos",
		"asin",
		"atan",
		"atan2",
		"ceil",
		"clamp",
		"cos",
		"cosh",
		"deg",
		"exp",
		"floor",
		"fmod",
		"frexp",
		"isfinite",
		"isinf",
		"isnan",
		"ldexp",
		"lerp",
		"log",
		"log10",
		"map",
		"max",
		"min",
		"modf",
		"noise",
		"pow",
		"rad",
		"random",
		"randomseed",
		"round",
		"sign",
		"sin",
		"sinh",
		"sqrt",
		"tan",
		"tanh",
	],
	os: ["clock", "date", "difftime", "time"],
	string: [
		"byte",
		"char",
		"find",
		"format",
		"gmatch",
		"gsub",
		"len",
		"lower",
		"match",
		"pack",
		"packsize",
		"rep",
		"reverse",
		"split",
		"sub",
		"unpack",
		"upper",
	],
	table: [
		"clear",
		"clone",
		"concat",
		"create",
		"find",
		"foreach",
		"foreachi",
		"freeze",
		"getn",
		"insert",
		"isfrozen",
		"maxn",
		"move",
		"pack",
		"remove",
		"sort",
		"unpack",
	],
	task: ["defer", "delay", "desynchronize", "spawn", "synchronize", "wait"],
	utf8: [
		"char",
		"codepoint",
		"codes",
		"graphemes",
		"len",
		"nfcnormalize",
		"nfdnormalize",
		"offset",
	],
	vector: [
		"abs",
		"angle",
		"ceil",
		"clamp",
		"create",
		"cross",
		"dot",
		"floor",
		"lerp",
		"magnitude",
		"max",
		"min",
		"normalize",
		"sign",
	],
};

/** Library constants — `support.constant.luau`, e.g. `math.huge`. */
export const LUAU_LIBRARY_CONSTANTS: Record<string, string[]> = {
	integer: ["maxsigned", "minsigned"],
	math: ["e", "huge", "nan", "phi", "pi", "sqrt2", "tau"],
	utf8: ["charpattern"],
	vector: ["one", "zero"],
};

/** Namespace names themselves — `support.constant.luau`. */
export const LUAU_LIBRARY_NAMES = Object.keys(LUAU_LIBRARIES);

/**
 * Parameter lists shown next to a completion item, as `(params): return`.
 * Purely informational — entries may be missing, in which case the completion
 * falls back to the bare qualified name. (The `integer` library is intentionally
 * left unsigned here rather than guessed at.)
 */
export const LUAU_SIGNATURES: Record<string, string> = {
	// globals
	assert: "(value: T, message: string?): T",
	collectgarbage: "(option: string?): number",
	error: "(message: any, level: number?): never",
	gcinfo: "(): number",
	getfenv: "(target: any?): {}",
	getmetatable: "(object: any): {}?",
	ipairs: "(t: {V}): iterator",
	loadstring:
		"(source: string, chunkname: string?): ((...any) -> ...any)?, string?",
	newproxy: "(addMetatable: boolean?): userdata",
	next: "(t: {[K]: V}, index: K?): (K?, V?)",
	pairs: "(t: {[K]: V}): iterator",
	pcall: "(fn: (...any) -> ...any, ...any): (boolean, ...any)",
	print: "(...any)",
	rawequal: "(a: any, b: any): boolean",
	rawset: "(t: {}, key: any, value: any): {}",
	require: "(module: any): any",
	select: '(index: number | "#", ...any): ...any',
	setfenv: "(target: any, env: {})",
	setmetatable: "(t: {}, metatable: {}?): {}",
	tonumber: "(value: any, base: number?): number?",
	tostring: "(value: any): string",
	type: "(value: any): string",
	typeof: "(value: any): string",
	unpack: "(list: {}, i: number?, j: number?): ...any",
	xpcall: "(fn: (...any) -> ...any, handler: (any) -> any, ...any): (boolean, ...any)",
	// Roblox globals
	delay: "(duration: number, callback: () -> ())",
	elapsedTime: "(): number",
	printidentity: "(prefix: string?)",
	settings: "(): Settings",
	spawn: "(callback: () -> ())",
	stats: "(): Stats",
	tick: "(): number",
	time: "(): number",
	version: "(): string",
	wait: "(duration: number?): (number, number)",
	warn: "(...any)",
	// bit32
	"bit32.arshift": "(n: number, disp: number): number",
	"bit32.band": "(...number): number",
	"bit32.bnot": "(n: number): number",
	"bit32.bor": "(...number): number",
	"bit32.btest": "(...number): boolean",
	"bit32.bxor": "(...number): number",
	"bit32.byteswap": "(n: number): number",
	"bit32.countlz": "(n: number): number",
	"bit32.countrz": "(n: number): number",
	"bit32.extract": "(n: number, field: number, width: number?): number",
	"bit32.lrotate": "(n: number, disp: number): number",
	"bit32.lshift": "(n: number, disp: number): number",
	"bit32.replace":
		"(n: number, v: number, field: number, width: number?): number",
	"bit32.rrotate": "(n: number, disp: number): number",
	"bit32.rshift": "(n: number, disp: number): number",
	// buffer
	"buffer.copy":
		"(target: buffer, targetOffset: number, source: buffer, sourceOffset: number?, count: number?)",
	"buffer.create": "(size: number): buffer",
	"buffer.fill": "(b: buffer, offset: number, value: number, count: number?)",
	"buffer.fromstring": "(str: string): buffer",
	"buffer.len": "(b: buffer): number",
	"buffer.readbits":
		"(b: buffer, bitOffset: number, bitCount: number): number",
	"buffer.readf32": "(b: buffer, offset: number): number",
	"buffer.readf64": "(b: buffer, offset: number): number",
	"buffer.readi16": "(b: buffer, offset: number): number",
	"buffer.readi32": "(b: buffer, offset: number): number",
	"buffer.readi8": "(b: buffer, offset: number): number",
	"buffer.readinteger": "(b: buffer, offset: number): integer",
	"buffer.readstring": "(b: buffer, offset: number, count: number): string",
	"buffer.readu16": "(b: buffer, offset: number): number",
	"buffer.readu32": "(b: buffer, offset: number): number",
	"buffer.readu8": "(b: buffer, offset: number): number",
	"buffer.tostring": "(b: buffer): string",
	"buffer.writebits":
		"(b: buffer, bitOffset: number, bitCount: number, value: number)",
	"buffer.writef32": "(b: buffer, offset: number, value: number)",
	"buffer.writef64": "(b: buffer, offset: number, value: number)",
	"buffer.writei16": "(b: buffer, offset: number, value: number)",
	"buffer.writei32": "(b: buffer, offset: number, value: number)",
	"buffer.writei8": "(b: buffer, offset: number, value: number)",
	"buffer.writeinteger": "(b: buffer, offset: number, value: integer)",
	"buffer.writestring":
		"(b: buffer, offset: number, value: string, count: number?)",
	"buffer.writeu16": "(b: buffer, offset: number, value: number)",
	"buffer.writeu32": "(b: buffer, offset: number, value: number)",
	"buffer.writeu8": "(b: buffer, offset: number, value: number)",
	// coroutine
	"coroutine.close": "(co: thread): (boolean, string?)",
	"coroutine.create": "(f: (...any) -> ...any): thread",
	"coroutine.isyieldable": "(): boolean",
	"coroutine.resume": "(co: thread, ...any): (boolean, ...any)",
	"coroutine.running": "(): thread",
	"coroutine.status": "(co: thread): string",
	"coroutine.wrap": "(f: (...any) -> ...any): (...any) -> ...any",
	"coroutine.yield": "(...any): ...any",
	// debug
	"debug.info":
		"(level: number | ((...any) -> ...any), options: string): ...any",
	"debug.loadmodule": "(module: any): any",
	"debug.profilebegin": "(label: string)",
	"debug.profileend": "()",
	"debug.traceback": "(message: string?, level: number?): string",
	// math
	"math.abs": "(x: number): number",
	"math.acos": "(x: number): number",
	"math.asin": "(x: number): number",
	"math.atan": "(x: number): number",
	"math.atan2": "(y: number, x: number): number",
	"math.ceil": "(x: number): number",
	"math.clamp": "(x: number, min: number, max: number): number",
	"math.cos": "(x: number): number",
	"math.cosh": "(x: number): number",
	"math.deg": "(x: number): number",
	"math.exp": "(x: number): number",
	"math.floor": "(x: number): number",
	"math.fmod": "(x: number, y: number): number",
	"math.frexp": "(x: number): (number, number)",
	"math.isfinite": "(x: number): boolean",
	"math.isinf": "(x: number): boolean",
	"math.isnan": "(x: number): boolean",
	"math.ldexp": "(m: number, e: number): number",
	"math.lerp": "(a: number, b: number, t: number): number",
	"math.log": "(x: number, base: number?): number",
	"math.log10": "(x: number): number",
	"math.map":
		"(x: number, inMin: number, inMax: number, outMin: number, outMax: number): number",
	"math.max": "(...number): number",
	"math.min": "(...number): number",
	"math.modf": "(x: number): (number, number)",
	"math.noise": "(x: number, y: number?, z: number?): number",
	"math.pow": "(x: number, y: number): number",
	"math.rad": "(x: number): number",
	"math.random": "(m: number?, n: number?): number",
	"math.randomseed": "(seed: number)",
	"math.round": "(x: number): number",
	"math.sign": "(x: number): number",
	"math.sin": "(x: number): number",
	"math.sinh": "(x: number): number",
	"math.sqrt": "(x: number): number",
	"math.tan": "(x: number): number",
	"math.tanh": "(x: number): number",
	// os
	"os.clock": "(): number",
	"os.date": "(format: string?, time: number?): string | {}",
	"os.difftime": "(t2: number, t1: number): number",
	"os.time": "(t: {}?): number",
	// string
	"string.byte": "(s: string, i: number?, j: number?): ...number",
	"string.char": "(...number): string",
	"string.find":
		"(s: string, pattern: string, init: number?, plain: boolean?): (number?, number?, ...any)",
	"string.format": "(s: string, ...any): string",
	"string.gmatch": "(s: string, pattern: string): iterator",
	"string.gsub":
		"(s: string, pattern: string, repl: any, n: number?): (string, number)",
	"string.len": "(s: string): number",
	"string.lower": "(s: string): string",
	"string.match": "(s: string, pattern: string, init: number?): ...any",
	"string.pack": "(fmt: string, ...any): string",
	"string.packsize": "(fmt: string): number",
	"string.rep": "(s: string, n: number, sep: string?): string",
	"string.reverse": "(s: string): string",
	"string.split": "(s: string, separator: string?): {string}",
	"string.sub": "(s: string, i: number, j: number?): string",
	"string.unpack": "(fmt: string, data: string, pos: number?): ...any",
	"string.upper": "(s: string): string",
	// table
	"table.clear": "(t: {})",
	"table.clone": "(t: {}): {}",
	"table.concat":
		"(t: {string}, sep: string?, i: number?, j: number?): string",
	"table.create": "(count: number, value: any?): {}",
	"table.find": "(haystack: {}, needle: any, init: number?): number?",
	"table.foreach": "(t: {}, f: (any, any) -> ())",
	"table.foreachi": "(t: {}, f: (number, any) -> ())",
	"table.freeze": "(t: {}): {}",
	"table.getn": "(t: {}): number",
	"table.insert": "(t: {}, pos: number?, value: any)",
	"table.isfrozen": "(t: {}): boolean",
	"table.maxn": "(t: {}): number",
	"table.move": "(src: {}, a: number, b: number, t: number, dst: {}?): {}",
	"table.pack": "(...any): {}",
	"table.remove": "(t: {}, pos: number?): any",
	"table.sort": "(t: {}, comp: ((a: any, b: any) -> boolean)?)",
	"table.unpack": "(list: {}, i: number?, j: number?): ...any",
	// task
	"task.defer": "(callback: any, ...any): thread",
	"task.delay": "(duration: number, callback: any, ...any): thread",
	"task.desynchronize": "()",
	"task.spawn": "(callback: any, ...any): thread",
	"task.synchronize": "()",
	"task.wait": "(duration: number?): number",
	// utf8
	"utf8.char": "(...number): string",
	"utf8.codepoint": "(s: string, i: number?, j: number?): ...number",
	"utf8.codes": "(s: string): iterator",
	"utf8.graphemes": "(s: string, i: number?, j: number?): iterator",
	"utf8.len": "(s: string, i: number?, j: number?): number?",
	"utf8.nfcnormalize": "(s: string): string",
	"utf8.nfdnormalize": "(s: string): string",
	"utf8.offset": "(s: string, n: number, i: number?): number",
	// vector
	"vector.abs": "(v: vector): vector",
	"vector.angle": "(a: vector, b: vector, axis: vector?): number",
	"vector.ceil": "(v: vector): vector",
	"vector.clamp": "(v: vector, min: vector, max: vector): vector",
	"vector.create": "(x: number, y: number, z: number?): vector",
	"vector.cross": "(a: vector, b: vector): vector",
	"vector.dot": "(a: vector, b: vector): number",
	"vector.floor": "(v: vector): vector",
	"vector.lerp": "(a: vector, b: vector, t: number): vector",
	"vector.magnitude": "(v: vector): number",
	"vector.max": "(...vector): vector",
	"vector.min": "(...vector): vector",
	"vector.normalize": "(v: vector): vector",
	"vector.sign": "(v: vector): vector",
};

/* ========================================================================== *
 * 2. Language configuration
 * ========================================================================== */

export const luauLanguageConfiguration: languages.LanguageConfiguration = {
	comments: {
		lineComment: "--",
		blockComment: ["--[[", "]]"],
	},
	brackets: [
		["{", "}"],
		["[", "]"],
		["(", ")"],
	],
	autoClosingPairs: [
		{ open: "{", close: "}" },
		{ open: "[", close: "]" },
		{ open: "(", close: ")" },
		{ open: '"', close: '"', notIn: ["string", "comment"] },
		{ open: "'", close: "'", notIn: ["string", "comment"] },
		{ open: "`", close: "`", notIn: ["string", "comment"] },
		{ open: "--[[", close: "]]", notIn: ["string"] },
	],
	surroundingPairs: [
		{ open: "{", close: "}" },
		{ open: "[", close: "]" },
		{ open: "(", close: ")" },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
		{ open: "`", close: "`" },
	],
	// Luau identifiers, so that `.` and `:` split words and member completion works.
	wordPattern: /(-?\d*\.\d\w*)|([^`~!@#%^&*()\-=+[{\]}\\|;:'",.<>/?\s]+)/g,
	indentationRules: {
		increaseIndentPattern:
			/^((?!--).)*((\b(else|function|then|do|repeat)\b((?!\b(end|until)\b).)*)|(\{\s*))$/,
		decreaseIndentPattern: /^\s*((\b(elseif|else|end|until)\b)|(\})|(\)))/,
	},
	folding: {
		markers: {
			start: /^\s*--\s*#?region\b/,
			end: /^\s*--\s*#?endregion\b/,
		},
	},
	onEnterRules: [
		{
			// keep writing `---` documentation comments on the next line
			beforeText: /^\s*---.*$/,
			action: {
				indentAction: 0 /* None */ as languages.IndentAction,
				appendText: "--- ",
			},
		},
	],
};

/* ========================================================================== *
 * 3. Monarch tokenizer
 *
 * Scope mapping (TextMate -> Monarch). Monarch token names are hierarchical and
 * themes match the longest defined prefix, so every name below starts with a
 * segment that stock Monaco themes already colour.
 *
 *   keyword.control.luau ................. keyword.flow
 *   storage.modifier.{local,const,...} ... keyword
 *   storage.type.luau (`type`) ........... keyword
 *   keyword.operator.wordlike ............ keyword.operator.wordlike
 *   keyword.operator.{type,typecast} ..... operator.{type,typecast}
 *   keyword.operator.{arith,cmp,assign} .. operator.{arithmetic,comparison,assignment}
 *   keyword.other.unit (`...`) ........... operator.vararg
 *   constant.language.boolean.* .......... constant.boolean
 *   constant.language.nil ................ constant.nil
 *   constant.language.luau ............... constant.language
 *   constant.numeric.* ................... number{,.hex,.binary,.float}
 *   constant.character.escape ............ string.escape
 *   string.* ............................. string
 *   comment.* ............................ comment{,.doc,.doc.tag}
 *   support.function.luau ................ variable.predefined.function
 *   support.constant.luau ................ variable.predefined.constant
 *   entity.name.function.luau ............ variable.function
 *   entity.name.type.luau ................ type.identifier
 *   support.type.primitive.luau .......... type.primitive
 *   variable.language.self ............... variable.language.self
 *   variable.language.metamethod ......... variable.language.metamethod
 *   variable.parameter.* ................. variable.parameter
 *   variable.other.property .............. variable.property
 *   variable.other.constant .............. variable.constant
 *   variable.other.readwrite ............. variable
 *   storage.modifier.access (read/write) . keyword
 *   meta.attribute.luau (`@native`) ...... annotation
 *   punctuation.* ........................ delimiter{,.curly,.square,.parenthesis,.angle}
 * ========================================================================== */

/** `a|b|c`, longest alternative first so prefixes cannot shadow longer names. */
function alternation(words: readonly string[]): string {
	return [...words].sort((a, b) => b.length - a.length).join("|");
}

/** `math\.(?:abs|acos|...)|table\.(?:...)|...` */
function qualified(groups: Record<string, string[]>): string {
	return Object.keys(groups)
		.map((ns) => `${ns}\\.(?:${alternation(groups[ns])})`)
		.join("|");
}

/**
 * Keyword classification shared by every identifier rule, in the same order the
 * grammar tries `#keyword`, `#language_constant` and `#standard_library`.
 * Spread into a `cases` object, which is evaluated top to bottom.
 */
const IDENTIFIER_CASES: Record<string, string> = {
	"@controlKeywords": "keyword.flow",
	"@storageKeywords": "keyword",
	"@wordOperators": "keyword.operator.wordlike",
	"@selfKeyword": "variable.language.self",
	"@booleans": "constant.boolean",
	"@nilKeyword": "constant.nil",
	"@globalFunctions": "variable.predefined.function",
	"@globalConstants": "constant.language",
	"@libraryNames": "variable.predefined.constant",
	"@robloxFunctions": "variable.predefined.function",
	"@robloxConstants": "constant.language",
};

/** Metamethod-aware classification for names that follow a `.` or a `:`. */
const MEMBER_CASES = {
	"@metamethods": "variable.language.metamethod",
	"@default": "variable.property",
};
const MEMBER_CALL_CASES = {
	"@metamethods": "variable.language.metamethod",
	"@default": "variable.function",
};

export const luauMonarchLanguage: languages.IMonarchLanguage = {
	defaultToken: "",
	tokenPostfix: ".luau",
	ignoreCase: false,

	brackets: [
		{ open: "{", close: "}", token: "delimiter.curly" },
		{ open: "[", close: "]", token: "delimiter.square" },
		{ open: "(", close: ")", token: "delimiter.parenthesis" },
	],

	// ---- word lists referenced by `cases` guards ----------------------------
	controlKeywords: LUAU_CONTROL_KEYWORDS,
	storageKeywords: LUAU_STORAGE_KEYWORDS,
	wordOperators: LUAU_WORD_OPERATORS,
	selfKeyword: ["self"],
	booleans: ["true", "false"],
	nilKeyword: ["nil"],
	metamethods: LUAU_METAMETHODS,
	typePrimitives: LUAU_TYPE_PRIMITIVES,
	globalFunctions: LUAU_GLOBAL_FUNCTIONS,
	globalConstants: LUAU_GLOBAL_CONSTANTS,
	robloxFunctions: LUAU_ROBLOX_FUNCTIONS,
	robloxConstants: LUAU_ROBLOX_CONSTANTS,
	libraryNames: LUAU_LIBRARY_NAMES,

	// ---- regex macros, referenced as `@name` inside rules -------------------
	identifier: /[a-zA-Z_]\w*/,
	/** What the grammar treats as "this name is being called". */
	callAhead: /(?=\s*(?:<<|[({"']|\[\[))/,
	escapes:
		/\\(?:[abfnrtvz'"`{\\]|\d{1,3}|x[0-9a-fA-F]{2}|u\{[0-9a-fA-F]*\}|$)/,
	/** `math.floor`, `table.insert`, ... */
	libraryCall: qualified(LUAU_LIBRARIES),
	/** `math.huge`, `vector.zero`, ... */
	libraryConstant: qualified(LUAU_LIBRARY_CONSTANTS),
	/**
	 * Operators that are valid in an expression but not at the top level of a
	 * type, so they mark the end of one (grammar: `nonTypeOperators`).
	 * `->`, `--` and `...` are excluded.
	 */
	nonTypeOperators: /[*+%^]|\/\/?|\.\.(?!\.)|-(?![->`])|~=|==/,
	/** Keywords that cannot appear inside a type (grammar: `nonTypeKeywords`). */
	nonTypeKeywords:
		/and|or|break|const|continue|do|else|elseif|end|for|function|if|in|local|repeat|return|then|until|while/,

	tokenizer: {
		root: [
			[/^#!.*$/, "comment"],
			{ include: "@whitespace" },
			{ include: "@declarations" },
			{ include: "@expression" },
		],

		// -- whitespace and comments -----------------------------------------
		whitespace: [
			[/[ \t\r]+/, "white"],
			[/--\[(=*)\[/, { token: "comment", next: "@blockComment.$1" }],
			[/---/, { token: "comment.doc", next: "@docComment" }],
			[/--.*$/, "comment"],
		],

		// `--[[ ... ]]`, `--[==[ ... ]==]`; `$S2` is the `=` run captured on entry
		blockComment: [
			// The grammar also has a `@param <name>` rule that would colour the name,
			// but its own `@\w+` rule above it matches first and shadows it, so the
			// name stays comment-coloured. Reproduced as-is.
			[/[\\@@]@identifier/, "comment.doc.tag"],
			[/[^\]\\@@]+/, "comment"],
			[/\]$S2\]/, { token: "comment", next: "@pop" }],
			[/./, "comment"],
		],

		// `--- documentation`, ends with the line
		docComment: [
			[/^/, { token: "", next: "@pop" }],
			[/[\\@@]@identifier/, "comment.doc.tag"],
			[/[^\\@@]+/, "comment.doc"],
			[/./, "comment.doc"],
		],

		// -- statements that introduce names ----------------------------------
		declarations: [
			// `type function f()` / `export type function f()`
			[
				/\b(export)(\s+)(type)(\s+)(function)\b/,
				[
					"keyword",
					"white",
					"keyword",
					"white",
					{ token: "keyword.flow", next: "@typeFunctionDecl" },
				],
			],
			[
				/\b(type)(\s+)(function)\b/,
				[
					"keyword",
					"white",
					{ token: "keyword.flow", next: "@typeFunctionDecl" },
				],
			],

			// `type Name ...` / `export type Name ...` (but not the `type()` global)
			[
				/\b(export)(\s+)(type)\b(?=\s+(?!function\b)@identifier)/,
				[
					"keyword",
					"white",
					{ token: "keyword", next: "@typeAliasDecl" },
				],
			],
			[
				/\b(type)\b(?=\s+(?!function\b)@identifier)/,
				{ token: "keyword", next: "@typeAliasDecl" },
			],

			// `function f()`, `local function f()`, `const`/`export function f()`
			[
				/\b(local|const|export)(\s+)(function)\b(?![,:])/,
				[
					"keyword",
					"white",
					{ token: "keyword.flow", next: "@functionDecl" },
				],
			],
			[
				/\b(function)\b(?![,:])/,
				{ token: "keyword.flow", next: "@functionDecl" },
			],

			// `local x`, `const x`, `export local x`
			[
				/\b(export)(\s+)(local|const)\b/,
				[
					"keyword",
					"white",
					{ token: "keyword", next: "@declaration" },
				],
			],
			[/\b(local|const)\b/, { token: "keyword", next: "@declaration" }],

			// `for i = ...` / `for k, v in ...`
			[/\b(for)\b/, { token: "keyword.flow", next: "@forLoop" }],
		],

		// `local`/`const`: names until `=`, `;`, `do` or the end of the line
		declaration: [
			[/^/, { token: "", next: "@pop" }],
			{ include: "@whitespace" },
			[/(?=[=;])|(?=\bdo\b)/, { token: "", next: "@pop" }],
			[/@@@identifier/, "annotation"],
			[/:/, { token: "operator.type", next: "@typeAnnotation" }],
			[/,/, "delimiter"],
			[
				/@identifier/,
				{
					cases: {
						"$0~[A-Z_][A-Z0-9_]*": "variable.constant",
						"@default": "variable",
					},
				},
			],
			[/./, { token: "@rematch", next: "@pop" }],
		],

		forLoop: [
			[/^/, { token: "", next: "@pop" }],
			{ include: "@whitespace" },
			[/\bin\b/, { token: "keyword.flow", next: "@pop" }],
			[/=/, { token: "operator.assignment", next: "@pop" }],
			[/:/, { token: "operator.type", next: "@typeAnnotation" }],
			[/,/, "delimiter"],
			[/@identifier/, "variable.parameter"],
			[/./, { token: "@rematch", next: "@pop" }],
		],

		// the name and generics of a function; `(` switches to the parameter list,
		// whose `)` ends the declaration (grammar: `end: (?<=[\)\-{}\[\]"'])`)
		functionDecl: [
			[/^/, { token: "", next: "@pop" }],
			{ include: "@whitespace" },
			[/</, { token: "delimiter.angle", next: "@genericsDecl" }],
			[/\(/, { token: "@brackets", switchTo: "@params" }],
			[/[.:]/, "delimiter"],
			[
				/@identifier/,
				{
					cases: {
						"@metamethods": "variable.language.metamethod",
						"@default": "variable.function",
					},
				},
			],
			[/./, { token: "@rematch", next: "@pop" }],
		],

		typeFunctionDecl: [
			[/^/, { token: "", next: "@pop" }],
			{ include: "@whitespace" },
			[/</, { token: "delimiter.angle", next: "@genericsDecl" }],
			[/\(/, { token: "@brackets", switchTo: "@params" }],
			[/@identifier/, "type.identifier"],
			[/./, { token: "@rematch", next: "@pop" }],
		],

		params: [
			{ include: "@whitespace" },
			[/\)/, { token: "@brackets", next: "@pop" }],
			[/\.\.\./, "variable.parameter"],
			// nothing below can legally appear in a parameter list: bail out so a
			// half-typed `function f(` cannot swallow the rest of the file
			[
				/\b(?:end|local|return|repeat|until|while|elseif|else|then|do)\b/,
				{ token: "@rematch", next: "@pop" },
			],
			[/@identifier/, "variable.parameter"],
			[/,/, "delimiter"],
			[/:/, { token: "operator.type", next: "@typeAnnotation" }],
		],

		typeAliasDecl: [
			[/=/, "operator.assignment"],
			{ include: "@typeStatement" },
		],

		// -- expressions -------------------------------------------------------
		expression: [
			// numbers first, so `.5` is a number and not member access
			[/\b0_*[xX]_*[\da-fA-F][\da-fA-F_]*i?/, "number.hex"],
			[/\b0_*[bB]_*[01][01_]*i?/, "number.binary"],
			[/\d[\d_]*i/, "number"],
			[
				/(?:\d[\d_]*(?:\.[\d_]*)?|\.\d[\d_]*)(?:[eE][+\-]?_*\d[\d_]*)?/,
				"number",
			],

			{ include: "@stringLiterals" },

			// `@native`, `@checked`, ...
			[/@@@identifier/, "annotation"],

			// qualified standard library before anything else can claim the name
			[/@libraryCall\b/, "variable.predefined.function"],
			[/@libraryConstant\b/, "variable.predefined.constant"],
			[/\bEnum(?:\.\w+){0,2}\b/, "constant.language"],

			// `...`
			[/\.\.\.(?!\.)/, "operator.vararg"],

			// member access and method calls; matching the `.`/`:` together with
			// the name replaces the grammar's lookbehinds
			[
				/(\.)(@identifier)@callAhead/,
				["delimiter", { cases: MEMBER_CALL_CASES }],
			],
			[/(\.)(@identifier)/, ["delimiter", { cases: MEMBER_CASES }]],
			[
				/(:)(@identifier)@callAhead/,
				["delimiter", { cases: MEMBER_CALL_CASES }],
			],

			// `expr :: Type` and `name: Type`
			[/::/, { token: "operator.typecast", next: "@typeStatement" }],
			[/:/, { token: "operator.type", next: "@typeAnnotation" }],

			// `f<<T>>(...)`
			[
				/<</,
				{ token: "delimiter.angle", next: "@genericsInstantiation" },
			],

			// identifiers, keywords, library names
			[
				/@identifier@callAhead/,
				{
					cases: {
						...IDENTIFIER_CASES,
						"@default": "variable.function",
					},
				},
			],
			[
				/@identifier/,
				{
					cases: {
						...IDENTIFIER_CASES,
						"$0~[A-Z_][A-Z0-9_]*": "variable.constant",
						"@default": "variable",
					},
				},
			],

			// operators, in the grammar's order
			[/==|~=|<=|>=|<|>/, "operator.comparison"],
			[/(?:\+|-|\/\/|\/|\*|%|\^|\.\.)=|=/, "operator.assignment"],
			[/\/\/|[+\-*%^]|\//, "operator.arithmetic"],
			[/#|\.\.(?!\.)/, "operator.other"],

			// brackets and separators
			[/\{/, { token: "@brackets", next: "@table" }],
			[/[()\[\]}]/, "@brackets"],
			[/[,;]/, "delimiter"],
			[/\./, "delimiter"],
		],

		// `{ ... }` constructor: tracked so that a table inside a `{}` string
		// interpolation does not close the interpolation
		table: [
			[/\}/, { token: "@brackets", next: "@pop" }],
			{ include: "@root" },
		],

		// -- strings -----------------------------------------------------------
		stringLiterals: [
			[/"/, { token: "string", next: "@stringDouble" }],
			[/'/, { token: "string", next: "@stringSingle" }],
			[/`/, { token: "string", next: "@stringInterpolated" }],
			[/\[(=*)\[/, { token: "string", next: "@longString.$1" }],
		],

		stringDouble: [
			[/[^\\"]+/, "string"],
			[/@escapes/, "string.escape"],
			[/\\/, "string"],
			[/"/, { token: "string", next: "@pop" }],
		],

		stringSingle: [
			[/[^\\']+/, "string"],
			[/@escapes/, "string.escape"],
			[/\\/, "string"],
			[/'/, { token: "string", next: "@pop" }],
		],

		stringInterpolated: [
			[/[^\\`{]+/, "string"],
			[/@escapes/, "string.escape"],
			[/\\/, "string"],
			[/\{/, { token: "@brackets", next: "@interpolatedExpression" }],
			[/`/, { token: "string", next: "@pop" }],
		],

		interpolatedExpression: [
			[/\}/, { token: "@brackets", next: "@pop" }],
			{ include: "@root" },
		],

		// `[[ ... ]]`, `[==[ ... ]==]`; `$S2` is the `=` run captured on entry
		longString: [
			[/[^\]]+/, "string"],
			[/\]$S2\]/, { token: "string", next: "@pop" }],
			[/./, "string"],
		],

		// -- types -------------------------------------------------------------

		/**
		 * A type that ends with the line: annotations on locals, parameters and
		 * return types (grammar: the `$` alternative of `#type_annotation`).
		 */
		typeAnnotation: [
			[/^/, { token: "", next: "@pop" }],
			[/(?=[=;])/, { token: "", next: "@pop" }],
			{ include: "@typeBody" },
		],

		/**
		 * A type that may span lines: `::` casts and `type X = ...` aliases
		 * (grammar: `lookAheadEndOfType`). It ends at a blank line, at another
		 * `type`/attribute, or at a line that starts a statement.
		 */
		typeStatement: [
			[/^\s*$/, { token: "", next: "@pop" }],
			[
				/^(?=\s*(?:@@|(?:export\s+)?type\b))/,
				{ token: "", next: "@pop" },
			],
			[
				/^(?=\s*@identifier(?:\.@identifier)*\s*(?:(?:[+\-*\/%^]|\.\.)?=(?!=)|\(|\[|:))/,
				{ token: "", next: "@pop" },
			],
			{ include: "@typeBody" },
		],

		/** The type grammar itself. */
		typeBody: [
			{ include: "@whitespace" },

			// end of the type: hand the text back to the enclosing state
			[/[)\],}](?!\s*[&|])/, { token: "@rematch", next: "@pop" }],
			[/(?=;)/, { token: "", next: "@pop" }],
			[/(?=@nonTypeOperators)/, { token: "", next: "@pop" }],
			[/\b(?:@nonTypeKeywords)\b/, { token: "@rematch", next: "@pop" }],

			// singleton string types
			{ include: "@stringLiterals" },

			[/->/, "operator.type"],
			[/[?&|]/, "operator.type"],
			[/\.\.\./, "operator.vararg"],

			[
				/\b(typeof)(\s*)(\()/,
				[
					"variable.predefined.function",
					"white",
					{ token: "@brackets", next: "@typeofExpr" },
				],
			],

			[/</, { token: "delimiter.angle", next: "@typeParams" }],
			[/\{/, { token: "@brackets", next: "@typeTable" }],
			[/\(/, { token: "@brackets", next: "@typeParen" }],

			[
				/@identifier/,
				{
					cases: {
						"@typePrimitives": "type.primitive",
						"@booleans": "constant.boolean",
						"@default": "type.identifier",
					},
				},
			],
			[/\./, "delimiter"],
		],

		/** `{ x: number, [string]: boolean }` */
		typeTable: [
			{ include: "@whitespace" },
			[/\}/, { token: "@brackets", next: "@pop" }],
			[/\b(?:read|write)\b(?=\s*\[)/, "keyword"],
			[/\[/, { token: "@brackets", next: "@typeIndex" }],
			// the `:` after an index signature — a TODO in the original grammar
			[/:/, "operator.type"],
			[
				/\b(read|write)(\s+)(@identifier)(\s*)(:)/,
				[
					"keyword",
					"white",
					"variable.property",
					"white",
					"operator.type",
				],
			],
			[
				/(@identifier)(\s*)(:)/,
				["variable.property", "white", "operator.type"],
			],
			[/[,;]/, "delimiter"],
			{ include: "@typeBody" },
		],

		/** `[string]` inside a table type */
		typeIndex: [
			[/\]/, { token: "@brackets", next: "@pop" }],
			[/,/, "delimiter"],
			{ include: "@typeBody" },
		],

		/** `(a: number, b: string) -> ...` */
		typeParen: [
			{ include: "@whitespace" },
			[/\)/, { token: "@brackets", next: "@pop" }],
			[
				/(@identifier)(\s*)(:)/,
				["variable.parameter", "white", "operator.type"],
			],
			[/,/, "delimiter"],
			[/\.\.\./, "operator.vararg"],
			{ include: "@typeBody" },
		],

		/**
		 * `<T, U = string>` on a function. The grammar's `#generics-declaration`
		 * puts its own identifier rule *before* `#type_literal`, so every name
		 * here is a type name — `U = string` makes `string` a name, not the
		 * primitive type.
		 */
		genericsDecl: [
			{ include: "@whitespace" },
			[/>/, { token: "delimiter.angle", next: "@pop" }],
			[/=/, "operator.assignment"],
			[/,/, "delimiter"],
			[/\.\.\./, "operator.vararg"],
			[/@identifier/, "type.identifier"],
			{ include: "@typeBody" },
		],

		/** `<T>` inside a type expression — primitives keep their own scope here */
		typeParams: [
			{ include: "@whitespace" },
			[/>/, { token: "delimiter.angle", next: "@pop" }],
			[/=/, "operator.assignment"],
			[/,/, "delimiter"],
			[/\.\.\./, "operator.vararg"],
			{ include: "@typeBody" },
		],

		/** `f<<number>>(x)` */
		genericsInstantiation: [
			{ include: "@whitespace" },
			[/>>/, { token: "delimiter.angle", next: "@pop" }],
			[/,/, "delimiter"],
			{ include: "@typeBody" },
		],

		/** `typeof(expr)` — ordinary code inside, nesting its own parentheses */
		typeofExpr: [
			[/\(/, { token: "@brackets", next: "@typeofExpr" }],
			[/\)/, { token: "@brackets", next: "@pop" }],
			{ include: "@root" },
		],
	},
};

/* ========================================================================== *
 * 4. Themes
 *
 * Optional: every token above starts with a segment stock themes already know,
 * so `vs`/`vs-dark` look sensible on their own. These two define the full
 * names, giving the same colours the TextMate grammar gets under Dark+/Light+.
 * Rules are suffixed with `.luau`, so they never affect other languages.
 * ========================================================================== */

/**
 * The language postfix is appended to the *end* of a token name, so a theme rule
 * has to be a full name: `delimiter.luau` does not match `delimiter.curly.luau`.
 * These are listed out so every rule actually applies to something.
 */
const PUNCTUATION_TOKENS = [
	"operator.arithmetic",
	"operator.assignment",
	"operator.comparison",
	"operator.other",
	"operator.type",
	"operator.typecast",
	"operator.vararg",
	"delimiter",
	"delimiter.angle",
	"delimiter.curly",
	"delimiter.parenthesis",
	"delimiter.square",
];

function themeRules(
	colors: Record<string, string>,
	punctuation: string,
): editor.ITokenThemeRule[] {
	const rules = Object.keys(colors).map((token) => ({
		token: `${token}.luau`,
		foreground: colors[token],
	}));
	for (const token of PUNCTUATION_TOKENS) {
		rules.push({ token: `${token}.luau`, foreground: punctuation });
	}
	return rules;
}

const DARK_COLORS: Record<string, string> = {
	comment: "6A9955",
	"comment.doc": "6A9955",
	"comment.doc.tag": "569CD6",
	string: "CE9178",
	"string.escape": "D7BA7D",
	number: "B5CEA8",
	"number.hex": "B5CEA8",
	"number.binary": "B5CEA8",
	keyword: "569CD6",
	"keyword.flow": "C586C0",
	"keyword.operator.wordlike": "569CD6",
	"constant.boolean": "569CD6",
	"constant.nil": "569CD6",
	"constant.language": "569CD6",
	variable: "9CDCFE",
	"variable.constant": "4FC1FF",
	"variable.property": "9CDCFE",
	"variable.parameter": "9CDCFE",
	"variable.function": "DCDCAA",
	"variable.predefined.function": "DCDCAA",
	"variable.predefined.constant": "4EC9B0",
	"variable.language.self": "569CD6",
	"variable.language.metamethod": "DCDCAA",
	"type.identifier": "4EC9B0",
	"type.primitive": "4EC9B0",
	annotation: "C586C0",
};
const DARK_PUNCTUATION = "D4D4D4";

const LIGHT_COLORS: Record<string, string> = {
	comment: "008000",
	"comment.doc": "008000",
	"comment.doc.tag": "0000FF",
	string: "A31515",
	"string.escape": "EE0000",
	number: "098658",
	"number.hex": "098658",
	"number.binary": "098658",
	keyword: "0000FF",
	"keyword.flow": "AF00DB",
	"keyword.operator.wordlike": "0000FF",
	"constant.boolean": "0000FF",
	"constant.nil": "0000FF",
	"constant.language": "0000FF",
	variable: "001080",
	"variable.constant": "0070C1",
	"variable.property": "001080",
	"variable.parameter": "001080",
	"variable.function": "795E26",
	"variable.predefined.function": "795E26",
	"variable.predefined.constant": "267F99",
	"variable.language.self": "0000FF",
	"variable.language.metamethod": "795E26",
	"type.identifier": "267F99",
	"type.primitive": "267F99",
	annotation: "AF00DB",
};
const LIGHT_PUNCTUATION = "000000";

export const luauDarkTheme: editor.IStandaloneThemeData = {
	base: "vs-dark",
	inherit: true,
	rules: themeRules(DARK_COLORS, DARK_PUNCTUATION),
	colors: {
		"editor.background": "#0a0a0a", //Monolith/shadcn theme
	},
};

export const luauLightTheme: editor.IStandaloneThemeData = {
	base: "vs",
	inherit: true,
	rules: themeRules(LIGHT_COLORS, LIGHT_PUNCTUATION),
	colors: {},
};

/* ========================================================================== *
 * 5. Completions
 * ========================================================================== */

type KindName =
	| "Keyword"
	| "Function"
	| "Variable"
	| "Constant"
	| "Module"
	| "Snippet"
	| "Struct"
	| "Property"
	| "Field";

interface Suggestion {
	label: string;
	kind: KindName;
	insertText: string;
	detail?: string;
	documentation?: string;
	snippet?: boolean;
	sortText?: string;
}

function signatureOf(qualifiedName: string): string | undefined {
	const sig = LUAU_SIGNATURES[qualifiedName];
	return sig ? qualifiedName + sig : undefined;
}

/** `sortText` prefixes, so the list is ordered by usefulness rather than name. */
const ORDER = {
	member: "0",
	local: "1",
	global: "2",
	library: "3",
	keyword: "4",
	snippet: "5",
};

const KEYWORD_SUGGESTIONS: Suggestion[] = LUAU_ALL_KEYWORDS.map((label) => ({
	label,
	kind: "Keyword",
	insertText: label,
	sortText: ORDER.keyword + label,
}));

const TYPE_SUGGESTIONS: Suggestion[] = LUAU_TYPE_PRIMITIVES.map((label) => ({
	label,
	kind: "Keyword",
	insertText: label,
	detail: "primitive type",
	sortText: ORDER.keyword + label,
}));

const GLOBAL_SUGGESTIONS: Suggestion[] = [
	...LUAU_GLOBAL_FUNCTIONS.map((label): Suggestion => ({
		label,
		kind: "Function",
		insertText: label,
		detail: signatureOf(label) ?? label,
		sortText: ORDER.global + label,
	})),
	...LUAU_ROBLOX_FUNCTIONS.map((label): Suggestion => ({
		label,
		kind: "Function",
		insertText: label,
		detail: signatureOf(label) ?? label,
		sortText: ORDER.global + label,
	})),
	...[...LUAU_GLOBAL_CONSTANTS, ...LUAU_ROBLOX_CONSTANTS].map(
		(label): Suggestion => ({
			label,
			kind: "Constant",
			insertText: label,
			detail: "global",
			sortText: ORDER.global + label,
		}),
	),
	...LUAU_LIBRARY_NAMES.map((label): Suggestion => ({
		label,
		kind: "Module",
		insertText: label,
		detail: "standard library",
		sortText: ORDER.library + label,
	})),
];

/** Members of one library, e.g. everything after `math.`. */
const LIBRARY_MEMBER_SUGGESTIONS: Record<string, Suggestion[]> = {};
for (const ns of LUAU_LIBRARY_NAMES) {
	const members: Suggestion[] = LUAU_LIBRARIES[ns].map((name) => ({
		label: name,
		kind: "Function",
		insertText: name,
		detail: signatureOf(`${ns}.${name}`) ?? `${ns}.${name}`,
		sortText: ORDER.member + name,
	}));
	for (const name of LUAU_LIBRARY_CONSTANTS[ns] ?? []) {
		members.push({
			label: name,
			kind: "Constant",
			insertText: name,
			detail: `${ns}.${name}`,
			sortText: ORDER.member + name,
		});
	}
	LIBRARY_MEMBER_SUGGESTIONS[ns] = members;
}

const SNIPPET_SUGGESTIONS: Suggestion[] = [
	{
		label: "function",
		detail: "function definition",
		insertText: "function ${1:name}(${2:params})\n\t$0\nend",
	},
	{
		label: "local function",
		detail: "local function definition",
		insertText: "local function ${1:name}(${2:params})\n\t$0\nend",
	},
	{
		label: "if",
		detail: "if statement",
		insertText: "if ${1:condition} then\n\t$0\nend",
	},
	{
		label: "ifelse",
		detail: "if/else statement",
		insertText: "if ${1:condition} then\n\t$2\nelse\n\t$0\nend",
	},
	{
		label: "for",
		detail: "numeric for loop",
		insertText: "for ${1:i} = ${2:1}, ${3:10} do\n\t$0\nend",
	},
	{
		label: "for ipairs",
		detail: "iterate an array",
		insertText:
			"for ${1:index}, ${2:value} in ipairs(${3:t}) do\n\t$0\nend",
	},
	{
		label: "for pairs",
		detail: "iterate a table",
		insertText: "for ${1:key}, ${2:value} in pairs(${3:t}) do\n\t$0\nend",
	},
	{
		label: "while",
		detail: "while loop",
		insertText: "while ${1:condition} do\n\t$0\nend",
	},
	{
		label: "repeat",
		detail: "repeat loop",
		insertText: "repeat\n\t$0\nuntil ${1:condition}",
	},
	{ label: "do", detail: "do block", insertText: "do\n\t$0\nend" },
	{ label: "type", detail: "type alias", insertText: "type ${1:Name} = $0" },
	{
		label: "pcall",
		detail: "protected call",
		insertText: "local ${1:ok}, ${2:err} = pcall(function()\n\t$0\nend)",
	},
].map((s) => ({
	...s,
	kind: "Snippet" as const,
	snippet: true,
	sortText: ORDER.snippet + s.label,
}));

/** Names the open document defines, so completion knows about local code too. */
interface DocumentIndex {
	types: string[];
	values: string[];
	/** receiver -> members seen on it, e.g. `module` -> `create` */
	members: Map<string, Set<string>>;
}

const KEYWORD_SET = new Set(LUAU_ALL_KEYWORDS);
const LIBRARY_SET = new Set(LUAU_LIBRARY_NAMES);
const documentIndexCache = new WeakMap<
	editor.ITextModel,
	{ version: number; index: DocumentIndex }
>();

function indexDocument(model: editor.ITextModel): DocumentIndex {
	const cached = documentIndexCache.get(model);
	if (cached && cached.version === model.getVersionId()) return cached.index;

	const text = model.getValue();
	const types = new Set<string>();
	const values = new Set<string>();
	const members = new Map<string, Set<string>>();

	for (const m of text.matchAll(
		/\b(?:export\s+)?type\s+(?:function\s+)?([A-Za-z_]\w*)/g,
	)) {
		types.add(m[1]);
	}
	for (const m of text.matchAll(/\bfunction\s+([A-Za-z_][\w.:]*)/g)) {
		const parts = m[1].split(/[.:]/);
		values.add(parts[0]);
		if (parts.length > 1) values.add(parts[parts.length - 1]);
	}
	for (const m of text.matchAll(
		/\blocal\s+(?:function\s+)?([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*)/g,
	)) {
		for (const name of m[1].split(",")) values.add(name.trim());
	}
	for (const m of text.matchAll(
		/\b([A-Za-z_]\w*)\s*[.:]\s*([A-Za-z_]\w*)/g,
	)) {
		if (LIBRARY_SET.has(m[1]) || KEYWORD_SET.has(m[1])) continue;
		let set = members.get(m[1]);
		if (!set) members.set(m[1], (set = new Set()));
		if (set.size < 200) set.add(m[2]);
	}
	for (const keyword of KEYWORD_SET) values.delete(keyword);

	const index: DocumentIndex = {
		types: [...types],
		values: [...values],
		members,
	};
	documentIndexCache.set(model, { version: model.getVersionId(), index });
	return index;
}

/**
 * Whether the cursor sits in code, or inside a string or comment where
 * completion would only be noise. `{...}` holes in an interpolated string count
 * as code. Single line only, which is all the heuristic needs to be.
 */
function lineContext(line: string): "code" | "comment" | "string" {
	let i = 0;
	while (i < line.length) {
		const ch = line[i];
		if (ch === "-" && line[i + 1] === "-") {
			const long = /^--\[(=*)\[/.exec(line.slice(i));
			if (!long) return "comment";
			const close = `]${long[1]}]`;
			const end = line.indexOf(close, i + long[0].length);
			if (end === -1) return "comment";
			i = end + close.length;
			continue;
		}
		if (ch === "[") {
			const long = /^\[(=*)\[/.exec(line.slice(i));
			if (long) {
				const close = `]${long[1]}]`;
				const end = line.indexOf(close, i + long[0].length);
				if (end === -1) return "string";
				i = end + close.length;
				continue;
			}
		}
		if (ch === '"' || ch === "'" || ch === "`") {
			const quote = ch;
			i++;
			while (i < line.length) {
				if (line[i] === "\\") {
					i += 2;
					continue;
				}
				if (quote === "`" && line[i] === "{") {
					// an interpolation hole: scan to its `}`, or stop if we are inside it
					let depth = 1;
					i++;
					while (i < line.length && depth > 0) {
						if (line[i] === "{") depth++;
						else if (line[i] === "}") depth--;
						i++;
					}
					if (depth > 0) return "code";
					continue;
				}
				if (line[i] === quote) {
					i++;
					break;
				}
				i++;
			}
			if (i >= line.length && line[line.length - 1] !== quote)
				return "string";
			continue;
		}
		i++;
	}
	return "code";
}

/**
 * Does the text before the cursor sit inside a type, rather than an expression?
 * The `:` of `local x: T` and the `:` of `obj:method()` are only told apart by
 * what surrounds them, so each shape is matched explicitly. A type "tail" is
 * anything that is not `=` or `;`, which is what ends an annotation.
 */
function isTypePosition(line: string): boolean {
	return (
		/::[^=;]*$/.test(line) || // x :: T
		/^\s*(?:export\s+)?type\s+[^=]*=[^=;]*$/.test(line) || // type X = T
		/^\s*(?:export\s+)?(?:local|const)\b[^=:]*:[^=;]*$/.test(line) || // local x: T
		/^\s*for\b[^=:]*:[^=;]*$/.test(line) || // for i: T
		/\bfunction\b[^=]*\)\s*:[^=;]*$/.test(line) || // function f(): T
		/\bfunction\b[^=]*\([^)=]*:[^=;]*$/.test(line) // function f(a: T
	);
}

export function registerLuauCompletionProvider(
	monaco: Monaco,
	languageId = "luau",
): IDisposable {
	const Kind = monaco.languages.CompletionItemKind;
	const asSnippet =
		monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;

	const toItem = (
		s: Suggestion,
		range: languages.CompletionItem["range"],
	): languages.CompletionItem => ({
		label: s.label,
		kind: Kind[s.kind],
		insertText: s.insertText,
		detail: s.detail,
		documentation: s.documentation,
		sortText: s.sortText,
		range,
		...(s.snippet ? { insertTextRules: asSnippet } : {}),
	});

	return monaco.languages.registerCompletionItemProvider(languageId, {
		triggerCharacters: [".", ":"],
		provideCompletionItems(model, position) {
			const line = model.getValueInRange({
				startLineNumber: position.lineNumber,
				startColumn: 1,
				endLineNumber: position.lineNumber,
				endColumn: position.column,
			});
			if (lineContext(line) !== "code") return { suggestions: [] };

			const word = model.getWordUntilPosition(position);
			const range = {
				startLineNumber: position.lineNumber,
				endLineNumber: position.lineNumber,
				startColumn: word.startColumn,
				endColumn: word.endColumn,
			};
			const index = indexDocument(model);
			const items = (list: Suggestion[]) => ({
				suggestions: list.map((s) => toItem(s, range)),
			});

			// `x :: T`, `local x: T`, `function f(): T`, `type X = T`
			if (isTypePosition(line)) {
				return items([
					...TYPE_SUGGESTIONS,
					...index.types.map((label): Suggestion => ({
						label,
						kind: "Struct",
						insertText: label,
						detail: "type",
						sortText: ORDER.local + label,
					})),
					{
						label: "typeof",
						kind: "Function",
						insertText: "typeof($0)",
						snippet: true,
						detail: "typeof(expression)",
						sortText: ORDER.keyword + "typeof",
					},
				]);
			}

			// `receiver.` / `receiver:`
			const member = /([A-Za-z_]\w*)\s*([.:])\s*[\w]*$/.exec(line);
			if (member) {
				const [, receiver, separator] = member;
				if (LIBRARY_SET.has(receiver)) {
					// `math:floor` is not callable, only `math.floor`
					return separator === "."
						? items(LIBRARY_MEMBER_SUGGESTIONS[receiver])
						: { suggestions: [] };
				}
				const seen = index.members.get(receiver);
				if (!seen) return { suggestions: [] };
				return items(
					[...seen].map((label) => ({
						label,
						kind: "Field",
						insertText: label,
						detail: `${receiver}${separator}${label}`,
						sortText: ORDER.member + label,
					})),
				);
			}

			return items([
				...index.values.map((label): Suggestion => ({
					label,
					kind: "Variable",
					insertText: label,
					sortText: ORDER.local + label,
				})),
				...GLOBAL_SUGGESTIONS,
				...KEYWORD_SUGGESTIONS,
				...SNIPPET_SUGGESTIONS,
				...index.types.map((label): Suggestion => ({
					label,
					kind: "Struct",
					insertText: label,
					detail: "type",
					sortText: ORDER.local + label,
				})),
			]);
		},
	});
}

/* ========================================================================== *
 * 6. Registration
 * ========================================================================== */

export interface RegisterLuauOptions {
	/** Defaults to `'luau'`. */
	languageId?: string;
	/** Defaults to `['.luau', '.lua']`. */
	extensions?: string[];
	/** Define the `luau-dark` / `luau-light` themes. Default: true. */
	defineThemes?: boolean;
	/** Register the completion provider. Default: true. */
	completions?: boolean;
}

/**
 * Registers the language, its configuration, the tokenizer, the completion
 * provider and the themes. Safe to call once per Monaco instance; disposing the
 * result removes the providers again.
 */
export function registerLuau(
	monaco: Monaco,
	options: RegisterLuauOptions = {},
): IDisposable {
	const languageId = options.languageId ?? "luau";
	const disposables: IDisposable[] = [];

	if (
		!monaco.languages
			.getLanguages()
			.some((language) => language.id === languageId)
	) {
		monaco.languages.register({
			id: languageId,
			extensions: options.extensions ?? [".luau", ".lua"],
			aliases: ["Luau", "luau"],
			mimetypes: ["text/x-luau"],
		});
	}

	disposables.push(
		monaco.languages.setLanguageConfiguration(
			languageId,
			luauLanguageConfiguration,
		),
	);
	disposables.push(
		monaco.languages.setMonarchTokensProvider(
			languageId,
			luauMonarchLanguage,
		),
	);

	if (options.completions !== false) {
		disposables.push(registerLuauCompletionProvider(monaco, languageId));
	}
	if (options.defineThemes !== false) {
		monaco.editor.defineTheme("luau-dark", luauDarkTheme);
		monaco.editor.defineTheme("luau-light", luauLightTheme);
	}

	return {
		dispose() {
			for (const disposable of disposables.splice(0))
				disposable.dispose();
		},
	};
}
