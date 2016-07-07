function setPng24(obj) {
	obj.width=obj.height=1;
	obj.className=obj.className.replace(/\bpng24\b/i,'');
	obj.style.filter =
	"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+ obj.src +"',sizingMethod='image');"
	obj.src=''; 
	return '';
}

// rollover image
function menuOn(imgEl) {
	imgEl.src = imgEl.src.replace(".gif", "_on.gif");
}

function menuOut(imgEl) {
	imgEl.src = imgEl.src.replace("_on.gif", ".gif");
}
// toggle menu
function initToggle(tabContainer) {
	triggers = tabContainer.getElementsByTagName("a"); //테이블의 a 태그로 선택 가능한 객체를 모두 가져온다. 
	
	for(i = 0; i < triggers.length; i++) { // a 태그의 수 만큼 반복
		if (triggers.item(i).href.split("#")[1]) // a 태그의 href 속성을 통하여 보여지고 숨겨질 내용을 가진 영역의 id를 받아온다. (# + id)
			triggers.item(i).targetEl = document.getElementById(triggers.item(i).href.split("#")[1]);
 
		if (!triggers.item(i).targetEl) // 보여지고 숨겨질 내용을 가진 영역의 id 가 없으면 다음 반복으로 넘어간다.
		{
			continue;
		}
		triggers.item(i).targetEl.style.display = "none"; // 숨겨지고 보여질 영역은 최초에는 모두 숨김 상태여야 한다.
		triggers.item(i).onclick = function () { // a 태그에 클릭 이벤트를 추가한다.
			if (tabContainer.current == this) { // 현재보여지는 영역의 a 태그가 현재 클릭된 a 태그와 동일한 경우의 처리
				this.targetEl.style.display = "none"; // 숨겨지고 보여질 영역을 숨긴다.
				tabContainer.current = null; // 현재 클릭된 영역이 없는 상태로 표현
				
			} else {// 현재보여지는 영역의 a 태그가 현재 클릭된 a 태그와 다를 경우의 처리
			    
				if (tabContainer.current) { // 이전 선택된 영역의 처리 숨겨져 있던 상태로  돌린다.
						tabContainer.current.targetEl.style.display = "none";
				}
				this.targetEl.style.display = "";
				tabContainer.current = this;
			}
			return false;
		}
	}
}
