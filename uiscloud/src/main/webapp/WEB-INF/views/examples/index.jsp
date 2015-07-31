<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="UTF-8"%>
    <%@taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Examples</title>

    <!-- Bootstrap Core CSS -->
    <link href="/resources/examples/bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- MetisMenu CSS -->
    <link href="/resources/examples/bower_components/metisMenu/dist/metisMenu.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="/resources/examples/dist/css/sb-admin-2.css" rel="stylesheet">


    <!-- Custom Fonts -->
    <link href="/resources/examples/bower_components/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>

    <div id="wrapper">

        <!-- Navigation -->
        <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="index.html">Examples</a>
            </div>
            <!-- /.navbar-header -->

            <div class="navbar-default sidebar" role="navigation">
                <div class="sidebar-nav navbar-collapse">
                    <ul class="nav" id="side-menu">
                        <li>
                            <a href="index.html"><i class="fa fa-dashboard fa-fw"></i> 예제 목록</a>
                        </li>
                        <li>
                            <a href="#"><i class="fa fa-bar-chart-o fa-fw"></i> 지도보기<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level">
                                <li>
                                    <a href="flot.html">기본 지도</a>
                                </li>
                                <li>
                                    <a href="morris.html">지도 조작</a>
                                </li>
                                <li>
                                    <a href="morris.html">지도 영역 조작</a>
                                </li>
                                <li>
                                    <a href="morris.html">지도 애니메이션</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
                        <li>
                            <a href="#"><i class="fa fa-bar-chart-o fa-fw"></i> 레이어<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level">
                                <li>
                                    <a href="flot.html">레이어 추가/삭제</a>
                                </li>
                                <li>
                                    <a href="morris.html">레이어 스택</a>
                                </li>
                                <li>
                                    <a href="morris.html">레이어 그룹</a>
                                </li>
                                <li>
                                    <a href="morris.html">이미지 레이어</a>
                                </li>
                                <li>
                                    <a href="morris.html">레이어 해상도</a>
                                </li>
                                <li>
                                    <a href="morris.html">히트맵 레이어</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
                        <li>
                            <a href="#"><i class="fa fa-bar-chart-o fa-fw"></i> 데이터와 형식<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level">
                                <li>
                                    <a href="flot.html">OpenLayers3 제공 타일</a>
                                </li>
                                <li>
                                    <a href="morris.html">WMTS 서버</a>
                                </li>
                                <li>
                                    <a href="morris.html">이미지캔버스 작업</a>
                                </li>
                                <li>
                                    <a href="morris.html">벡터 소스</a>
                                </li>
                                <li>
                                    <a href="morris.html">WMS 서버 데이터 요청</a>
                                </li>
                                <li>
                                    <a href="morris.html">벡터를 래스터로 렌더링</a>
                                </li>
                                <li>
                                    <a href="morris.html">WFS 서버 데이터 요청</a>
                                </li>
                                <li>
                                    <a href="morris.html">로딩 전략에 대한 작업</a>
                                </li>
                                <li>
                                    <a href="morris.html">WMS 기능 읽기</a>
                                </li>
                                <li>
                                    <a href="morris.html">features 입력/삭제</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
                        <li>
                            <a href="#"><i class="fa fa-bar-chart-o fa-fw"></i> 벡터 레이어<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level">
                                <li>
                                    <a href="flot.html">공간 정보</a>
                                </li>
                                <li>
                                    <a href="morris.html">features 생성</a>
                                </li>
                                <li>
                                    <a href="morris.html">스타일</a>
                                </li>
                                <li>
                                    <a href="morris.html">아이콘 스타일링</a>
                                </li>
                                <li>
                                    <a href="morris.html">스타일 내의 텍스트</a>
                                </li>
                                <li>
                                    <a href="morris.html">스타일 함수 작업</a>
                                </li>
                                <li>
                                    <a href="morris.html">features 제어</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
                        <li>
                            <a href="#"><i class="fa fa-bar-chart-o fa-fw"></i> 이벤트의 리스너와 속성<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level">
                                <li>
                                    <a href="flot.html">이벤트의 리스너와 속성</a>
                                </li>
                                <li>
                                    <a href="morris.html">지도 동기화</a>
                                </li>
                                <li>
                                    <a href="morris.html">마우스의 위치 표시</a>
                                </li>
                                <li>
                                    <a href="morris.html">Listening for changes on vector data</a>
                                </li>
                                <li>
                                    <a href="morris.html">마우스 포인터의 features 스타일링</a>
                                </li>
                                <li>
                                    <a href="morris.html">마우스 포인터의 features 스타일링</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
                        <li>
                            <a href="#"><i class="fa fa-bar-chart-o fa-fw"></i> 오버레이<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level">
                                <li>
                                    <a href="flot.html">기본 오버레이</a>
                                </li>
                                <li>
                                    <a href="morris.html">마커 구현</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
                        <li>
                            <a href="#"><i class="fa fa-bar-chart-o fa-fw"></i> 컨트롤과 인터렉션<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level">
                                <li>
                                    <a href="flot.html">정적 지도</a>
                                </li>
                                <li>
                                    <a href="morris.html">컨트롤 실행</a>
                                </li>
                                <li>
                                    <a href="morris.html">사용자 정의 컨트롤</a>
                                </li>
                                <li>
                                    <a href="morris.html">Feature 오버레이</a>
                                </li>
                                <li>
                                    <a href="morris.html">인터렉션 관리</a>
                                </li>
                                <li>
                                    <a href="morris.html">features 선택</a>
                                </li>
                                <li>
                                    <a href="morris.html">features 편집</a>
                                </li>
                                <li>
                                    <a href="morris.html">드래그로 features 선택</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
                    </ul>
                </div>
                <!-- /.sidebar-collapse -->
            </div>
            <!-- /.navbar-static-side -->
        </nav>

        <div id="page-wrapper">
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">Dashboard</h1>
                </div>
                <!-- /.col-lg-12 -->
            </div>
        </div>
        <!-- /#page-wrapper -->

    </div>
    <!-- /#wrapper -->

<!--     jQuery
    <script src="/resources/examples/bower_components/jquery/dist/jquery.min.js"></script>

    Bootstrap Core JavaScript
    <script src="/resources/examples/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
 -->
 
    <script type="text/javascript" src="/webjars/jquery/2.1.3/jquery.min.js"></script>
	<script type="text/javascript" src="/webjars/bootstrap/3.3.2-1/js/bootstrap.min.js"></script>
	
    <!-- Metis Menu Plugin JavaScript -->
<!--     <script src="/resources/examples/bower_components/metisMenu/dist/metisMenu.min.js"></script>
 -->

    <!-- Custom Theme JavaScript -->
    <script src="/resources/examples/dist/js/sb-admin-2.js"></script>

</body>

</html>
