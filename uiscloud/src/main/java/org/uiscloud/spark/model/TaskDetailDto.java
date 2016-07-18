package org.uiscloud.spark.model;

public class TaskDetailDto extends SparkDtoObject{
	private int taskId;
	private int index;
	private int attempt;
	private String launchTime;
	private String executorId;
	private String host;
	private String taskLocality;
	private boolean speculative;
	private String[] accumulatorUpdates;
	private TaskMetricsDto taskMetrics;
	
	public int getTaskId() {
		return taskId;
	}
	public void setTaskId(int taskId) {
		this.taskId = taskId;
	}
	public int getIndex() {
		return index;
	}
	public void setIndex(int index) {
		this.index = index;
	}
	public int getAttempt() {
		return attempt;
	}
	public void setAttempt(int attempt) {
		this.attempt = attempt;
	}
	public String getLaunchTime() {
		return launchTime;
	}
	public void setLaunchTime(String launchTime) {
		this.launchTime = launchTime;
	}
	public String getExecutorId() {
		return executorId;
	}
	public void setExecutorId(String executorId) {
		this.executorId = executorId;
	}
	public String getHost() {
		return host;
	}
	public void setHost(String host) {
		this.host = host;
	}
	public String getTaskLocality() {
		return taskLocality;
	}
	public void setTaskLocality(String taskLocality) {
		this.taskLocality = taskLocality;
	}
	public boolean isSpeculative() {
		return speculative;
	}
	public void setSpeculative(boolean speculative) {
		this.speculative = speculative;
	}
	public String[] getAccumulatorUpdates() {
		return accumulatorUpdates;
	}
	public void setAccumulatorUpdates(String[] accumulatorUpdates) {
		this.accumulatorUpdates = accumulatorUpdates;
	}
	public TaskMetricsDto getTaskMetrics() {
		return taskMetrics;
	}
	public void setTaskMetrics(TaskMetricsDto taskMetrics) {
		this.taskMetrics = taskMetrics;
	}
	
	
	
}
