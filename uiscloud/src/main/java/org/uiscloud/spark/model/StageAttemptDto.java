package org.uiscloud.spark.model;

public class StageAttemptDto extends SparkDtoObject{
	
	
	private String status;
	private String stageId;
	private int attemptId;
	private int numActiveTasks;
	private int numCompleteTasks;
	private int numCompletedTasks;
	private int numFailedTasks;
	private int executorRunTime;
	private int inputBytes;
	private int inputRecords;
	private int outputBytes;
	private int outputRecords;
	private int shuffleReadBytes;
	private int shuffleReadRecords;
	private int shuffleWriteBytes;
	private int shuffleWriteRecords;
	private int memoryBytesSpilled;
	private int diskBytesSpilled;
	private String name;
	private String details;
	private String schedulingPool;
	private String[] accumulatorUpdates;
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getStageId() {
		return stageId;
	}
	public void setStageId(String stageId) {
		this.stageId = stageId;
	}
	public int getAttemptId() {
		return attemptId;
	}
	public void setAttemptId(int attemptId) {
		this.attemptId = attemptId;
	}
	public int getNumActiveTasks() {
		return numActiveTasks;
	}
	public void setNumActiveTasks(int numActiveTasks) {
		this.numActiveTasks = numActiveTasks;
	}
	public int getNumCompleteTasks() {
		return numCompleteTasks;
	}
	public void setNumCompleteTasks(int numCompleteTasks) {
		this.numCompleteTasks = numCompleteTasks;
	}
	public int getNumCompletedTasks() {
		return numCompletedTasks;
	}
	public void setNumCompletedTasks(int numCompletedTasks) {
		this.numCompletedTasks = numCompletedTasks;
	}
	public int getNumFailedTasks() {
		return numFailedTasks;
	}
	public void setNumFailedTasks(int numFailedTasks) {
		this.numFailedTasks = numFailedTasks;
	}
	public int getExecutorRunTime() {
		return executorRunTime;
	}
	public void setExecutorRunTime(int executorRunTime) {
		this.executorRunTime = executorRunTime;
	}
	public int getInputBytes() {
		return inputBytes;
	}
	public void setInputBytes(int inputBytes) {
		this.inputBytes = inputBytes;
	}
	public int getInputRecords() {
		return inputRecords;
	}
	public void setInputRecords(int inputRecords) {
		this.inputRecords = inputRecords;
	}
	public int getOutputBytes() {
		return outputBytes;
	}
	public void setOutputBytes(int outputBytes) {
		this.outputBytes = outputBytes;
	}
	public int getOutputRecords() {
		return outputRecords;
	}
	public void setOutputRecords(int outputRecords) {
		this.outputRecords = outputRecords;
	}
	public int getShuffleReadBytes() {
		return shuffleReadBytes;
	}
	public void setShuffleReadBytes(int shuffleReadBytes) {
		this.shuffleReadBytes = shuffleReadBytes;
	}
	public int getShuffleReadRecords() {
		return shuffleReadRecords;
	}
	public void setShuffleReadRecords(int shuffleReadRecords) {
		this.shuffleReadRecords = shuffleReadRecords;
	}
	public int getShuffleWriteBytes() {
		return shuffleWriteBytes;
	}
	public void setShuffleWriteBytes(int shuffleWriteBytes) {
		this.shuffleWriteBytes = shuffleWriteBytes;
	}
	public int getShuffleWriteRecords() {
		return shuffleWriteRecords;
	}
	public void setShuffleWriteRecords(int shuffleWriteRecords) {
		this.shuffleWriteRecords = shuffleWriteRecords;
	}
	public int getMemoryBytesSpilled() {
		return memoryBytesSpilled;
	}
	public void setMemoryBytesSpilled(int memoryBytesSpilled) {
		this.memoryBytesSpilled = memoryBytesSpilled;
	}
	public int getDiskBytesSpilled() {
		return diskBytesSpilled;
	}
	public void setDiskBytesSpilled(int diskBytesSpilled) {
		this.diskBytesSpilled = diskBytesSpilled;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDetails() {
		return details;
	}
	public void setDetails(String details) {
		this.details = details;
	}
	public String getSchedulingPool() {
		return schedulingPool;
	}
	public void setSchedulingPool(String schedulingPool) {
		this.schedulingPool = schedulingPool;
	}
	public String[] getAccumulatorUpdates() {
		return accumulatorUpdates;
	}
	public void setAccumulatorUpdates(String[] accumulatorUpdates) {
		this.accumulatorUpdates = accumulatorUpdates;
	}
	
	
	
	
}
