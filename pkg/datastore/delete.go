package datastore

import "context"

func (ds *Datastore) DeleteGame(ctx context.Context, placeid string) error {
	if c_err := ds.redis.Del(ctx, placeid).Err(); c_err != nil {
		return c_err
	}
	return ds.pg.Where("game_place_id = ?", placeid).Delete(&Game{}).Error
}

func (ds *Datastore) DeleteJob(ctx context.Context, jobid string) error {
	if c_err := ds.redis.Del(ctx, jobid).Err(); c_err != nil {
		return c_err
	}
	if c_err := ds.redis.Del(ctx, jobid+":players").Err(); c_err != nil {
		return c_err
	}
	return ds.pg.Unscoped().Where("job_id = ?", jobid).Delete(&Job{}).Error
}

func (ds *Datastore) DeletePlayers(ctx context.Context, jobid string, players Players) error {
	for id, name := range players {
		if id_s_err := ds.redis.SRem(ctx, jobid+":players", id+":"+name).Err(); id_s_err != nil {
			return id_s_err
		}
	}
	return nil
}
