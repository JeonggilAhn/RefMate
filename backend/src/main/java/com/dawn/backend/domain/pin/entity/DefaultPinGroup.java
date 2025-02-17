package com.dawn.backend.domain.pin.entity;

import lombok.Getter;

@Getter
public enum DefaultPinGroup {
	GROUP1("수정필요", "#ED3131", "#FFE5E5"),     // 빨간색 - 주의/경고의 의미로 수정 필요 사항의 밝은 버전
	GROUP2("조명계획", "#F7825B", "#FFE9E0"),     // 주황색 - 따뜻하고 밝은 느낌의 조명의 밝은 버전
	GROUP3("컬러계획", "#F8D477", "#FFF5E0"),     // 노란색 - 밝고 경쾌한 색상 계획의 밝은 버전
	GROUP4("식물/그린", "#9CE27E", "#F0FFE5"),    // 연두색 - 자연과 식물 요소의 밝은 버전
	GROUP5("수납/정리", "#65B08E", "#E5F5F0"),    // 청록색 - 차분하고 정돈된 느낌의 수납의 밝은 버전
	GROUP6("마감재", "#87B5FA", "#E5F0FF"),       // 하늘색 - 깨끗하고 상쾌한 마감재의 밝은 버전
	GROUP7("공간구성", "#647FE1", "#E5EAFF"),     // 파란색 - 안정감 있는 공간 계획의 밝은 버전
	GROUP8("포인트/강조", "#D084E0", "#F5E5FF"),  // 보라색 - 고급스러운 포인트 요소의 밝은 버전
	GROUP9("패브릭", "#FE8ADD", "#FFE5F5"),       // 분홍색 - 부드럽고 따뜻한 패브릭의 밝은 버전
	GROUP0("기타사항", "#B6B6B6", "#F0F0F0");     // 회색 - 중립적인 기타 요소의 밝은 버전

	private final String name;
	private final String color;
	private final String lightColor;

	DefaultPinGroup(String name, String color, String lightColor) {
		this.name = name;
		this.color = color;
		this.lightColor = lightColor;
	}
}
