package org.uiscloud.spark.model;

import java.util.ArrayList;

public class ProcessInfo {
	private String id;
	private String title;
	private int status;
	
	ArrayList<ProcessInfo> subMenu;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public ArrayList<ProcessInfo> getSubMenu() {
		return subMenu;
	}
	public void setSubMenu(ArrayList<ProcessInfo> subMenu) {
		this.subMenu = subMenu;
	}
	
	public void addSubMenu(ProcessInfo processInfo) {
		if(this.subMenu == null) 
			this.subMenu = new ArrayList<ProcessInfo>();
		this.subMenu.add(processInfo);
	}

	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	
}
