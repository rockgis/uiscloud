package org.uiscloud.spark.model.mongodb;

public class AggregateGroupDao {
	private String _id="$geometry";
	private GroupCountObjectDto maxCount=new GroupCountObjectDto();
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public GroupCountObjectDto getMaxCount() {
		return maxCount;
	}
	public void setMaxCount(GroupCountObjectDto maxCount) {
		this.maxCount = maxCount;
	}

}
