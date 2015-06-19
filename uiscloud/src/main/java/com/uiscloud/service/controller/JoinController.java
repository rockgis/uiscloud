package com.uiscloud.service.controller;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Locale;

import javax.annotation.Resource;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.uiscloud.service.domain.Login;
import com.uiscloud.service.domain.Member;
import com.uiscloud.service.service.JoinService;
import com.uiscloud.service.service.LoginService;
import com.uiscloud.service.util.JsonConvertor;

/**
 * Handles requests for the application home page.
 */
@Controller
public class JoinController {
	private static final Logger logger = LoggerFactory
			.getLogger(LoginController.class);

	@Resource
	private JoinService joinService;

	@Resource
	private JavaMailSender javaMailSender;

	public JoinService getJoinService() {
		return joinService;
	}

	public void setJoinService(JoinService JoinService) {
		this.joinService = JoinService;
	}

	public JavaMailSender getJavaMailSender() {
		return javaMailSender;
	}

	public void setJavaMailSender(JavaMailSender javaMailSender) {
		this.javaMailSender = javaMailSender;
	}

	// 회원가입
	@RequestMapping(value = "/join", method = RequestMethod.GET)
	public String join(Locale locale, Model model) {
		model.addAttribute("login", new Login());
		return "/join/JoinF";
	}

	// 회원가입
	@RequestMapping(value = "/join", method = RequestMethod.POST)
	public String join(Locale locale, Model model, HttpSession session,
			@Valid Login login, BindingResult result) {
		if (result.hasErrors()) {
			model.addAttribute("jsonLogin",
					JsonConvertor.getJsonFromObject(login));
			return "/join/LoginF";
		}

		if (joinService.isNewMember(login.getUserId()) == true) {
			MimeMessage mimeMessage = javaMailSender.createMimeMessage();

			try {
				Member member = joinService.join(login);

				String code = Base64.getEncoder().encodeToString(
						member.getUserId().getBytes(StandardCharsets.UTF_8));

				StringBuilder htmlContent = new StringBuilder();

				htmlContent.append("<strong>안녕하세요. ????????입입니다.</strong><br/>");
				htmlContent
						.append(" 회원 가입을 완료하시리면 다음 코드를 회원 가입화면에 입력해 주세요.<br/>");
				htmlContent.append(String.format("코드: %s<br />", code));
				htmlContent.append("또는 다음 URL을 클릭해서 다음 작업을 진행해 주세요.<br/>");
				htmlContent
						.append(String
								.format("<a href='http://www.myhair.com/m/checkJoinMail?code=%s'>회원 가입 완료하기</a>",
										code));

				MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(
						mimeMessage, true, "UTF-8");
				mimeMessageHelper.setSubject("회원 가입 확인 안내");
				mimeMessageHelper.setText(htmlContent.toString(), true);
				mimeMessageHelper.setFrom("no-reply@myhair.com", "운영자");
				mimeMessageHelper.setTo(new InternetAddress(login.getUserId(),
						"UTF-8"));
				javaMailSender.send(mimeMessage);

				return "redirect:/checkJoinMail";
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			model.addAttribute("message", "이미 가입된 이메일 주소 입니다.");
			return "/join/JoinF";
		}

		return "/error";
	}
}
