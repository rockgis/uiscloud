
package org.uiscloud.spark.utils;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @author hooni
 *
 */
public class RequestUtils {

    /**
     * @return the httpServletRequest
     */
    public static HttpServletRequest getHttpServletRequest() {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes instanceof ServletRequestAttributes) {
            return ((ServletRequestAttributes) requestAttributes).getRequest();
        }

        return null;
    }

    public static RequestAttributes getRequestAttributes() {
        return RequestContextHolder.getRequestAttributes();
    }

    public static boolean isAdminAccess() {
        return isAdminAccess(RequestUtils.getHttpServletRequest() == null ? null : RequestUtils.getHttpServletRequest());
    }

    /**
     * '/wise/admin/' 이렇게 접근하는 uri는 모두 어드민 접근으로 처리한다.
     * /wise/로 시작하지 않는 경우, scope파라미터에 따라서 결정한다.
     * 즉 scope 파라미터의 value가 'admin'이면 관리자단 접근으로, 'user'이면 사용자단 접근으로 처리한다.
     * 모두 판단하지 못하면, 사용자단 접근으로 처리한다.
     *
     * @param request current HttpServletRequest
     * @return 관리자단 접근 여부
     */
    public static boolean isAdminAccess(HttpServletRequest request) {
        if(request == null) {
            return false;
        }

        String requestURI = request.getRequestURI();
        if(requestURI.toLowerCase().startsWith("/admin/")
                || requestURI.toLowerCase().equals("/admin")) {
            return true;
        }

        String scope = RequestUtils.getHttpServletRequest().getParameter("scope");

        if(scope != null && "user".equals(scope)) {
            return false;
        } else if(scope != null && "admin".equals(scope)) {
            return true;
        }

        return false;
    }

    public static boolean isUserAccess() {
        return !isAdminAccess();
    }

    public static boolean isUserAccess(HttpServletRequest request) {
        return !isAdminAccess(request);
    }

    public static String getRequestURI() {
        return RequestUtils.getHttpServletRequest() == null ? "" : RequestUtils.getHttpServletRequest().getRequestURI();
    }

    public static String getRequestURI(HttpServletRequest request) {
        if(request == null) {
            return "";
        }

        return request.getRequestURI();
    }

    public static String getRequestURL() {
        return RequestUtils.getHttpServletRequest() == null ? "" : RequestUtils.getHttpServletRequest().getRequestURL().toString();
    }

    public static String getRequestURL(HttpServletRequest request) {
        if(request == null) {
            return "";
        }

        return request.getRequestURL().toString();
    }

    public static boolean isAjaxRequest(HttpServletRequest request) {
        String acceptHeader = request.getHeader("Accept");
        String ajaxParam = request.getParameter("ajax");
        if ("text/html;type=ajax".equals(acceptHeader) || !StringUtils.isEmpty(ajaxParam)) {
            return true;
        }

        return false;
    }

}
