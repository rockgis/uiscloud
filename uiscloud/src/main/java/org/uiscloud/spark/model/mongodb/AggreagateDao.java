package org.uiscloud.spark.model.mongodb;

public class AggreagateDao {
	
	private MatchDao $match;
	private AggregateGroupDao $group= new AggregateGroupDao();

	
	
	public MatchDao get$match() {
		return $match;
	}
	public void set$match(MatchDao $match) {
		this.$match = $match;
	}
	public AggregateGroupDao get$group() {
		return $group;
	}
	public void set$group(AggregateGroupDao $group) {
		this.$group = $group;
	}

}
