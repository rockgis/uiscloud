package org.uiscloud.spark.model;

import java.util.Map;

public class ExecutorDto extends SparkDtoObject{
	private String id;
	private String hostPort;
	private int rddBlocks;
	private int memoryUsed;
	private int diskUsed;
	private int activeTasks;
	private int failedTasks;
	private int completedTasks;
	private int totalTasks;
	private int totalDuration;
	private int totalInputBytes;
	private int totalShuffleRead;
	private int totalShuffleWrite;
	private int maxMemory;
	private Map<String, String> executorLogs;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getHostPort() {
		return hostPort;
	}
	public void setHostPort(String hostPort) {
		this.hostPort = hostPort;
	}
	public int getRddBlocks() {
		return rddBlocks;
	}
	public void setRddBlocks(int rddBlocks) {
		this.rddBlocks = rddBlocks;
	}
	public int getMemoryUsed() {
		return memoryUsed;
	}
	public void setMemoryUsed(int memoryUsed) {
		this.memoryUsed = memoryUsed;
	}
	public int getDiskUsed() {
		return diskUsed;
	}
	public void setDiskUsed(int diskUsed) {
		this.diskUsed = diskUsed;
	}
	public int getActiveTasks() {
		return activeTasks;
	}
	public void setActiveTasks(int activeTasks) {
		this.activeTasks = activeTasks;
	}
	public int getFailedTasks() {
		return failedTasks;
	}
	public void setFailedTasks(int failedTasks) {
		this.failedTasks = failedTasks;
	}
	public int getCompletedTasks() {
		return completedTasks;
	}
	public void setCompletedTasks(int completedTasks) {
		this.completedTasks = completedTasks;
	}
	public int getTotalTasks() {
		return totalTasks;
	}
	public void setTotalTasks(int totalTasks) {
		this.totalTasks = totalTasks;
	}
	public int getTotalDuration() {
		return totalDuration;
	}
	public void setTotalDuration(int totalDuration) {
		this.totalDuration = totalDuration;
	}
	public int getTotalInputBytes() {
		return totalInputBytes;
	}
	public void setTotalInputBytes(int totalInputBytes) {
		this.totalInputBytes = totalInputBytes;
	}
	public int getTotalShuffleRead() {
		return totalShuffleRead;
	}
	public void setTotalShuffleRead(int totalShuffleRead) {
		this.totalShuffleRead = totalShuffleRead;
	}
	public int getTotalShuffleWrite() {
		return totalShuffleWrite;
	}
	public void setTotalShuffleWrite(int totalShuffleWrite) {
		this.totalShuffleWrite = totalShuffleWrite;
	}
	public int getMaxMemory() {
		return maxMemory;
	}
	public void setMaxMemory(int maxMemory) {
		this.maxMemory = maxMemory;
	}
	public Map<String, String> getExecutorLogs() {
		return executorLogs;
	}
	public void setExecutorLogs(Map<String, String> executorLogs) {
		this.executorLogs = executorLogs;
	}
	
	

}
