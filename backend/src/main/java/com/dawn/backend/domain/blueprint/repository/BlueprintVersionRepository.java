package com.dawn.backend.domain.blueprint.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
}
