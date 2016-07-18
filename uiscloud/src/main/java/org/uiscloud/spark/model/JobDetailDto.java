package org.uiscloud.spark.model;

public class JobDetailDto extends SparkDtoObject{
	private String jobId;
	private String name;
	
	private String description;
	
	private String submissionTime;
	private String[] stageIds;
	
	private String status;
	
	private int numTasks;
	private int numActiveTasks;
	private int numCompletedTasks;
	private int numSkippedTasks;
	private int numFailedTasks;

	private int numActiveStages;
	private int numCompletedStages;
	private int numSkippedStages;
	private int numFailedStages;
	
	
	public String getJobId() {
		return jobId;
	}
	public void setJobId(String jobId) {
		this.jobId = jobId;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSubmissionTime() {
		return submissionTime;
	}
	public void setSubmissionTime(String submissionTime) {
		this.submissionTime = submissionTime;
	}
	public String[] getStageIds() {
		return stageIds;
	}
	public void setStageIds(String[] stageIds) {
		this.stageIds = stageIds;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public int getNumTasks() {
		return numTasks;
	}
	public void setNumTasks(int numTasks) {
		this.numTasks = numTasks;
	}
	public int getNumActiveTasks() {
		return numActiveTasks;
	}
	public void setNumActiveTasks(int numActiveTasks) {
		this.numActiveTasks = numActiveTasks;
	}
	public int getNumCompletedTasks() {
		return numCompletedTasks;
	}
	public void setNumCompletedTasks(int numCompletedTasks) {
		this.numCompletedTasks = numCompletedTasks;
	}
	public int getNumSkippedTasks() {
		return numSkippedTasks;
	}
	public void setNumSkippedTasks(int numSkippedTasks) {
		this.numSkippedTasks = numSkippedTasks;
	}
	public int getNumFailedTasks() {
		return numFailedTasks;
	}
	public void setNumFailedTasks(int numFailedTasks) {
		this.numFailedTasks = numFailedTasks;
	}
	public int getNumActiveStages() {
		return numActiveStages;
	}
	public void setNumActiveStages(int numActiveStages) {
		this.numActiveStages = numActiveStages;
	}
	public int getNumCompletedStages() {
		return numCompletedStages;
	}
	public void setNumCompletedStages(int numCompletedStages) {
		this.numCompletedStages = numCompletedStages;
	}
	public int getNumSkippedStages() {
		return numSkippedStages;
	}
	public void setNumSkippedStages(int numSkippedStages) {
		this.numSkippedStages = numSkippedStages;
	}
	public int getNumFailedStages() {
		return numFailedStages;
	}
	public void setNumFailedStages(int numFailedStages) {
		this.numFailedStages = numFailedStages;
	}
}
