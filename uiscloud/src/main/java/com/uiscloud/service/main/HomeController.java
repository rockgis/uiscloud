package com.uiscloud.service.main;

import java.util.Locale;

import javax.annotation.Resource;

import org.springframework.context.MessageSource;
import org.springframework.context.MessageSourceAware;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {
	@Resource
	private MessageSource messageSource;
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping({ "/main", "/"})
	public String home(Locale locale, Model model) {
		
		String msg = messageSource.getMessage("required.keyword", null, Locale.KOREA); 
	    System.out.println("DEBUG : " + msg ); 
	
		return "MainF";
	}

	@RequestMapping(value = "/map", method = RequestMethod.GET)
	public String map(Locale locale, Model model) {
		
		String msg = messageSource.getMessage("required.keyword", null, Locale.KOREA); 
	    System.out.println("DEBUG : " + msg ); 
	
		return "/map/gisMainF";
	}
	
	@RequestMapping(value = "/examples", method = RequestMethod.GET)
	public String examples(Locale locale, Model model) {
		
		String msg = messageSource.getMessage("required.keyword", null, Locale.KOREA); 
	    System.out.println("DEBUG : " + msg ); 
	
		return "/examples/layouts/layout";
	}
	@RequestMapping(value = "/openmap", method = RequestMethod.GET)
	public String openmap(Locale locale, Model model) {
		
		String msg = messageSource.getMessage("required.keyword", null, Locale.KOREA); 
	    System.out.println("DEBUG : " + msg ); 
	
		return "/map/openMainF";
	}
	
	@RequestMapping(value = "/basicMap", method = RequestMethod.GET)
	public String basicMap(Locale locale, Model model) {
		
		String msg = messageSource.getMessage("required.keyword", null, Locale.KOREA); 
	    System.out.println("DEBUG : " + msg ); 
	
		return "/edu/basicMapF";
	}
	
	@RequestMapping(value = "/otherMap", method = RequestMethod.GET)
	public String otherMap(Locale locale, Model model) {
		
		String msg = messageSource.getMessage("required.keyword", null, Locale.KOREA); 
	    System.out.println("DEBUG : " + msg ); 
	
		return "/edu/otherMapF";
	}
}
