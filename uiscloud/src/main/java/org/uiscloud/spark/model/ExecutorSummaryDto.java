package org.uiscloud.spark.model;

public class ExecutorSummaryDto extends SparkDtoObject{
	
	private int taskTime;
	private int failedTasks;
	private int succeededTasks;
	private int inputBytes;
	private int outputBytes;
	private int shuffleRead;
	private int shuffleWrite;
	private int memoryBytesSpilled;
	private int diskBytesSpilled;
	public int getTaskTime() {
		return taskTime;
	}
	public void setTaskTime(int taskTime) {
		this.taskTime = taskTime;
	}
	public int getFailedTasks() {
		return failedTasks;
	}
	public void setFailedTasks(int failedTasks) {
		this.failedTasks = failedTasks;
	}
	public int getSucceededTasks() {
		return succeededTasks;
	}
	public void setSucceededTasks(int succeededTasks) {
		this.succeededTasks = succeededTasks;
	}
	public int getInputBytes() {
		return inputBytes;
	}
	public void setInputBytes(int inputBytes) {
		this.inputBytes = inputBytes;
	}
	public int getOutputBytes() {
		return outputBytes;
	}
	public void setOutputBytes(int outputBytes) {
		this.outputBytes = outputBytes;
	}
	public int getShuffleRead() {
		return shuffleRead;
	}
	public void setShuffleRead(int shuffleRead) {
		this.shuffleRead = shuffleRead;
	}
	public int getShuffleWrite() {
		return shuffleWrite;
	}
	public void setShuffleWrite(int shuffleWrite) {
		this.shuffleWrite = shuffleWrite;
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

	
}
