package com.dawn.backend.domain.blueprint.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;

@Repository
public interface BlueprintVersionRepository extends JpaRepository<BlueprintVersion, Long> {
	@Query(
		"SELECT bv"
		+ " FROM BlueprintVersion bv"
		+ " WHERE bv.blueprint.blueprintId = :blueprintId"
		+ " ORDER BY bv.blueprintVersionSeq"
	)
	BlueprintVersion findLatestVersion(Long blueprintId);

	List<BlueprintVersion> findAllByBlueprintBlueprintIdOrderByBlueprintVersionSeq(Long blueprintId);

	@Modifying
	@Query(
		"UPDATE BlueprintVersion bv "
		+ "SET bv.postBlueprintVersion.blueprintVersionId = :#{postVersion.blueprintVersionId} "
		+ "WHERE bv.blueprintVersionId = :#{preVersion.blueprintVersionId}"
	)
	void updatePostVersion(BlueprintVersion preVersion, BlueprintVersion postVersion);
}
