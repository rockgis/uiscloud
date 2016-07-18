package org.uiscloud.spark.model.mongodb;

public class MaxCountDao extends GroupCountObjectDto {
	private String $max ="$count";

	public String get$max() {
		return $max;
	}

	public void set$max(String $max) {
		this.$max = $max;
	}
}
