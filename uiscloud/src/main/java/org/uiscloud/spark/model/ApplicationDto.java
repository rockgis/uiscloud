package org.uiscloud.spark.model;

import java.util.ArrayList;

public class ApplicationDto extends SparkDtoObject{
	private String id;
	private String name;
	private ArrayList<Attempt> attempts;

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public ArrayList<Attempt> getAttempts() {
		return attempts;
	}
	public void setAttempts(ArrayList<Attempt> attempts) {
		this.attempts = attempts;
	}
	
}
