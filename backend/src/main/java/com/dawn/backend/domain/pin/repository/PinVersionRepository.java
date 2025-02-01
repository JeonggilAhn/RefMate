package com.dawn.backend.domain.pin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.pin.entity.PinVersion;

@Repository
public interface PinVersionRepository extends JpaRepository<PinVersion, Long> {
	List<PinVersion> findAllByBlueprintVersionBlueprintVersionId(Long blueprintVersionId);

	PinVersion findFirstByBlueprintVersionBlueprintVersionIdAndPinPinId(Long blueprintVersionId, Long pinId);
}
