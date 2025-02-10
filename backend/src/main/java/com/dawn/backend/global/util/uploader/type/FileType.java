package com.dawn.backend.global.util.uploader.type;

import lombok.Getter;

@Getter
public enum FileType {
	JPG("image/jpg"),
	JPEG("image/jpeg"),
	PNG("image/png"),
	DWG("application/acad"),
	PDF("application/pdf");

	private final String type;

	FileType(String type) {
		this.type = type;
	}

	public static FileType getFileType(String type) {
		for (FileType ft : FileType.values()) {
			if (ft.getType().equals(type)) {
				return ft;
			}
		}

		return null;
	}
}
