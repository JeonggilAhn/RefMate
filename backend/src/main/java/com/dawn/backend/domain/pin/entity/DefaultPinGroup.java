package com.dawn.backend.domain.pin.entity;

import lombok.Getter;

@Getter
public enum DefaultPinGroup {
	GROUP1("1번그룹", "#000000"),
	GROUP2("2번그룹", "#000000"),
	GROUP3("3번그룹", "#000000"),
	GROUP4("4번그룹", "#000000"),
	GROUP5("5번그룹", "#000000"),
	GROUP6("6번그룹", "#000000"),
	GROUP7("7번그룹", "#000000"),
	GROUP8("8번그룹", "#000000"),
	GROUP9("9번그룹", "#000000"),
	GROUP0("10번그룹", "#000000");

	private final String name;
	private final String color;

	DefaultPinGroup(String name, String color) {
		this.name = name;
		this.color = color;
	}
}
