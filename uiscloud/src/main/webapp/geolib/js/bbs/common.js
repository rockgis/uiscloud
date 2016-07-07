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
	triggers = tabContainer.getElementsByTagName("a"); //���̺��� a �±׷� ���� ������ ��ü�� ��� �����´�. 
	
	for(i = 0; i < triggers.length; i++) { // a �±��� �� ��ŭ �ݺ�
		if (triggers.item(i).href.split("#")[1]) // a �±��� href �Ӽ��� ���Ͽ� �������� ������ ������ ���� ������ id�� �޾ƿ´�. (# + id)
			triggers.item(i).targetEl = document.getElementById(triggers.item(i).href.split("#")[1]);
 
		if (!triggers.item(i).targetEl) // �������� ������ ������ ���� ������ id �� ������ ���� �ݺ����� �Ѿ��.
		{
			continue;
		}
		triggers.item(i).targetEl.style.display = "none"; // �������� ������ ������ ���ʿ��� ��� ���� ���¿��� �Ѵ�.
		triggers.item(i).onclick = function () { // a �±׿� Ŭ�� �̺�Ʈ�� �߰��Ѵ�.
			if (tabContainer.current == this) { // ���纸������ ������ a �±װ� ���� Ŭ���� a �±׿� ������ ����� ó��
				this.targetEl.style.display = "none"; // �������� ������ ������ �����.
				tabContainer.current = null; // ���� Ŭ���� ������ ���� ���·� ǥ��
				
			} else {// ���纸������ ������ a �±װ� ���� Ŭ���� a �±׿� �ٸ� ����� ó��
			    
				if (tabContainer.current) { // ���� ���õ� ������ ó�� ������ �ִ� ���·�  ������.
						tabContainer.current.targetEl.style.display = "none";
				}
				this.targetEl.style.display = "";
				tabContainer.current = this;
			}
			return false;
		}
	}
}
