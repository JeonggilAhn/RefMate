package com.dawn.backend.domain.pin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.domain.pin.entity.Pin;
import com.dawn.backend.domain.pin.entity.PinVersion;

@Repository
public interface PinVersionRepository extends JpaRepository<PinVersion, Long> {

	// 모든 pinGroupId의 모든 상태 핀 검색
	@Query("""
		SELECT pv
		FROM PinVersion pv
		WHERE pv.blueprintVersion.blueprintVersionId = :blueprintVersionId
		""")
	List<PinVersion> findAllByBlueprintVersionId(Long blueprintVersionId);

	// 특정 pinGroupId의 모든 상태 핀 조회
	@Query("""
		SELECT pv
		FROM PinVersion pv
		WHERE pv.blueprintVersion.blueprintVersionId = :blueprintVersionId
			AND pv.pinGroup.pinGroupId = :pinGroupId
		""")
	List<PinVersion> findAllByBlueprintVersionIdAndPinGroupId(Long blueprintVersionId, Long pinGroupId);

	// 특정 활성/비활성 상태의 모든 pinGroupId 핀 조회
	@Query("""
		SELECT pv
		FROM PinVersion pv
		WHERE pv.blueprintVersion.blueprintVersionId = :blueprintVersionId
			AND pv.isActive = :isActive
		""")
	List<PinVersion> findAllByBlueprintVersionIdAndIsActive(Long blueprintVersionId, Boolean isActive);

	// 특정 pinGroupId의 특정 활성/비활성 상태 핀 조회
	@Query("""
		SELECt pv
		FROM PinVersion pv
		WHERE pv.blueprintVersion.blueprintVersionId = :blueprintVersionId
			AND pv.pinGroup.pinGroupId = :pinGroupId
			AND pv.isActive = :isActive
		""")
	List<PinVersion> findAllByBlueprintVersionIdAndPinGroupIdAndIsActive(
		Long blueprintVersionId,
		Long pinGroupId,
		Boolean isActive
	);

	List<PinVersion> findAllByBlueprintVersionBlueprintVersionId(Long blueprintVersionId);

	List<PinVersion> findAllByBlueprintVersionBlueprintVersionIdAndIsActive(Long blueprintVersionId, Boolean isActive);

	PinVersion findFirstByBlueprintVersionBlueprintVersionIdAndPinPinId(Long blueprintVersionId, Long pinId);

	Optional<PinVersion> findByBlueprintVersionAndPinAndIsActive(
		BlueprintVersion blueprintVersion,
		Pin pin,
		Boolean isActive
	);

	PinVersion findFirstByPinPinId(Long pinId);
}
