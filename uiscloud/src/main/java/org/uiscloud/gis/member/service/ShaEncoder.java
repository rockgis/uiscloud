package org.uiscloud.gis.member.service;

import javax.annotation.Resource;
 
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;
import org.springframework.stereotype.Service;
 
@Service("shaEncoder")
public class ShaEncoder {
 
 @Resource(name="passwordEncoder")
 private ShaPasswordEncoder encoder;
 
 public String encoding(String str){
  return encoder.encodePassword(str,null);
 }
 
 /*
 public String decoding(String str){
	  return encoder.(str,null);
	 }*/
}