import {
	metaHelper,
	rowSelectionFeature,
	tableFeatures,
	useTable,
	type ColumnDef,
	type OnChangeFn,
	type RowData,
	type RowSelectionState,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export interface DataTableColumnMeta {
	/** Applied to both the header and body cells of the column. */
	className?: string;
}

export const dataTableFeatures = tableFeatures({
	rowSelectionFeature,
	columnMeta: metaHelper<DataTableColumnMeta>(),
});

interface DataTableProps<TData extends RowData> {
	columns: ColumnDef<typeof dataTableFeatures, TData, any>[];
	data: TData[];
	getRowId?: (row: TData, index: number) => string;
	emptyMessage?: string;
	rowSelection?: RowSelectionState;
	onRowSelectionChange?: OnChangeFn<RowSelectionState>;
}

export function DataTable<TData extends RowData>({
	columns,
	data,
	getRowId,
	emptyMessage = "No results.",
	rowSelection,
	onRowSelectionChange,
}: DataTableProps<TData>) {
	const isSelectionControlled =
		rowSelection !== undefined && onRowSelectionChange !== undefined;

	const table = useTable({
		features: dataTableFeatures,
		columns,
		data,
		getRowId,
		...(isSelectionControlled
			? { state: { rowSelection }, onRowSelectionChange }
			: {}),
	});

	return (
		<Table>
			<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<TableHead
								key={header.id}
								className={header.column.columnDef.meta?.className}
							>
								{header.isPlaceholder ? null : (
									<table.FlexRender header={header} />
								)}
							</TableHead>
						))}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows.length ? (
					table.getRowModel().rows.map((row) => (
						<TableRow
							key={row.id}
							data-state={row.getIsSelected() ? "selected" : undefined}
						>
							{row.getAllCells().map((cell) => (
								<TableCell
									key={cell.id}
									className={cell.column.columnDef.meta?.className}
								>
									<table.FlexRender cell={cell} />
								</TableCell>
							))}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell
							colSpan={columns.length}
							className="h-24 text-center opacity-50"
						>
							{emptyMessage}
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
