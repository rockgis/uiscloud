package org.uiscloud.spark.model;

public class StageTaksSummaryDto extends SparkDtoObject{
	private long[] quantiles;
	private long[] executorDeserializeTime;
	private long[] executorRunTime;
	private long[] resultSize;
	private long[] jvmGcTime;
	private long[] resultSerializationTime;
	private long[] memoryBytesSpilled;
	private long[] diskBytesSpilled;
	
	public long[] getQuantiles() {
		return quantiles;
	}
	public void setQuantiles(long[] quantiles) {
		this.quantiles = quantiles;
	}
	public long[] getExecutorDeserializeTime() {
		return executorDeserializeTime;
	}
	public void setExecutorDeserializeTime(long[] executorDeserializeTime) {
		this.executorDeserializeTime = executorDeserializeTime;
	}
	public long[] getExecutorRunTime() {
		return executorRunTime;
	}
	public void setExecutorRunTime(long[] executorRunTime) {
		this.executorRunTime = executorRunTime;
	}
	public long[] getResultSize() {
		return resultSize;
	}
	public void setResultSize(long[] resultSize) {
		this.resultSize = resultSize;
	}
	public long[] getJvmGcTime() {
		return jvmGcTime;
	}
	public void setJvmGcTime(long[] jvmGcTime) {
		this.jvmGcTime = jvmGcTime;
	}
	public long[] getResultSerializationTime() {
		return resultSerializationTime;
	}
	public void setResultSerializationTime(long[] resultSerializationTime) {
		this.resultSerializationTime = resultSerializationTime;
	}
	public long[] getMemoryBytesSpilled() {
		return memoryBytesSpilled;
	}
	public void setMemoryBytesSpilled(long[] memoryBytesSpilled) {
		this.memoryBytesSpilled = memoryBytesSpilled;
	}
	public long[] getDiskBytesSpilled() {
		return diskBytesSpilled;
	}
	public void setDiskBytesSpilled(long[] diskBytesSpilled) {
		this.diskBytesSpilled = diskBytesSpilled;
	}
	
	
}
