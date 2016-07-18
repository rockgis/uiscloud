package org.uiscloud.spark.model;

public class TaskMetricsDto extends SparkDtoObject{
	private int executorDeserializeTime;
	private int executorRunTime;
	private int resultSize;
	private int jvmGcTime;
	private int resultSerializationTime;
	private int memoryBytesSpilled;
	private int diskBytesSpilled;
	
	public int getExecutorDeserializeTime() {
		return executorDeserializeTime;
	}
	public void setExecutorDeserializeTime(int executorDeserializeTime) {
		this.executorDeserializeTime = executorDeserializeTime;
	}
	public int getExecutorRunTime() {
		return executorRunTime;
	}
	public void setExecutorRunTime(int executorRunTime) {
		this.executorRunTime = executorRunTime;
	}
	public int getResultSize() {
		return resultSize;
	}
	public void setResultSize(int resultSize) {
		this.resultSize = resultSize;
	}
	public int getJvmGcTime() {
		return jvmGcTime;
	}
	public void setJvmGcTime(int jvmGcTime) {
		this.jvmGcTime = jvmGcTime;
	}
	public int getResultSerializationTime() {
		return resultSerializationTime;
	}
	public void setResultSerializationTime(int resultSerializationTime) {
		this.resultSerializationTime = resultSerializationTime;
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
