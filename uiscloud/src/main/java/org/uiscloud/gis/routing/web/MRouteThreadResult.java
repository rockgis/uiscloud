package org.uiscloud.gis.routing.web;

import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;

public class MRouteThreadResult {

	List<String> notfounds = new LinkedList<String>();
	List<LinkedHashMap<String, Object>> last = new LinkedList<LinkedHashMap<String, Object>>();
	List<String> targetsToDelete = new LinkedList<String>();
	List<NotReachableDemand> notReachableBldg = new LinkedList<NotReachableDemand>();

	public MRouteThreadResult(List<String> notfounds, List<LinkedHashMap<String, Object>> last, List<String> targetsToDelete, List<NotReachableDemand> notReachableBldg) {
		this.notfounds = notfounds;
		this.last = last;
		this.targetsToDelete = targetsToDelete;
		this.notReachableBldg = notReachableBldg;
	}

	public List<String> getNotfounds() {
		return notfounds;
	}

	public void setNotfounds(List<String> notfounds) {
		this.notfounds = notfounds;
	}

	public List<LinkedHashMap<String, Object>> getLast() {
		return last;
	}

	public void setLast(List<LinkedHashMap<String, Object>> last) {
		this.last = last;
	}

	public List<String> getTargetsToDelete() {
		return targetsToDelete;
	}

	public void setTargetsToDelete(List<String> targetsToDelete) {
		this.targetsToDelete = targetsToDelete;
	}

	public List<NotReachableDemand> getNotReachableBldg() {
		return notReachableBldg;
	}

	public void setNotReachableBldg(List<NotReachableDemand> notReachableBldg) {
		this.notReachableBldg = notReachableBldg;
	}

}
