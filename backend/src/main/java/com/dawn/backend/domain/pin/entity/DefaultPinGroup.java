package com.dawn.backend.domain.pin.entity;

import lombok.Getter;

@Getter
public enum DefaultPinGroup {
	GROUP1("수정필요", "#ED3131"),     // 빨간색 - 주의/경고의 의미로 수정 필요 사항
	GROUP2("조명계획", "#F7825B"),     // 주황색 - 따뜻하고 밝은 느낌의 조명
	GROUP3("컬러계획", "#F8D477"),     // 노란색 - 밝고 경쾌한 색상 계획
	GROUP4("식물/그린", "#9CE27E"),    // 연두색 - 자연과 식물 요소
	GROUP5("수납/정리", "#65B08E"),    // 청록색 - 차분하고 정돈된 느낌의 수납
	GROUP6("마감재", "#87B5FA"),       // 하늘색 - 깨끗하고 상쾌한 마감재
	GROUP7("공간구성", "#647FE1"),     // 파란색 - 안정감 있는 공간 계획
	GROUP8("포인트/강조", "#D084E0"),  // 보라색 - 고급스러운 포인트 요소
	GROUP9("패브릭", "#FE8ADD"),       // 분홍색 - 부드럽고 따뜻한 패브릭
	GROUP0("기타사항", "#B6B6B6");     // 회색 - 중립적인 기타 요소

	private final String name;
	private final String color;

	DefaultPinGroup(String name, String color) {
		this.name = name;
		this.color = color;
	}
}
