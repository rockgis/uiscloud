package org.uiscloud.spark.model;

public class Attempt extends SparkDtoObject{
	private String startTime;
	private String endTIme;
	private String sparkUser;
	private boolean completed;
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTIme() {
		return endTIme;
	}
	public void setEndTIme(String endTIme) {
		this.endTIme = endTIme;
	}
	public String getSparkUser() {
		return sparkUser;
	}
	public void setSparkUser(String sparkUser) {
		this.sparkUser = sparkUser;
	}
	public boolean isCompleted() {
		return completed;
	}
	public void setCompleted(boolean completed) {
		this.completed = completed;
	}
}
