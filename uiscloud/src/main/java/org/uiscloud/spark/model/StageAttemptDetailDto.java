package org.uiscloud.spark.model;

import java.util.Map;

public class StageAttemptDetailDto extends StageAttemptDto{
	
	private Map<String , TaskDetailDto> tasks;
	private Map<String , ExecutorSummaryDto> executorSummary;
	
	public Map<String, TaskDetailDto> getTasks() {
		return tasks;
	}
	public void setTasks(Map<String, TaskDetailDto> tasks) {
		this.tasks = tasks;
	}
	public Map<String, ExecutorSummaryDto> getExecutorSummary() {
		return executorSummary;
	}
	public void setExecutorSummary(Map<String, ExecutorSummaryDto> executorSummary) {
		this.executorSummary = executorSummary;
	}
	
}
