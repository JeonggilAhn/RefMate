package com.dawn.backend.domain.blueprint.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;

@Repository
public interface BlueprintVersionRepository extends JpaRepository<BlueprintVersion, Long> {
	@Query(
		value =
			"SELECT * FROM blueprint_version bv "
				+ "WHERE bv.blueprint_id = :blueprintId "
				+ "ORDER BY bv.blueprint_version_seq DESC LIMIT 1",
		nativeQuery = true)
	BlueprintVersion findLatestVersion(Long blueprintId);

	List<BlueprintVersion> findAllByBlueprintBlueprintIdOrderByBlueprintVersionSeq(Long blueprintId);

	@Query("""
			SELECT bv FROM BlueprintVersion bv
			WHERE bv.blueprint.blueprintId IN :blueprintIds
			ORDER BY bv.createdAt DESC
		""")
	List<BlueprintVersion> findLatestBlueprintVersionsByBlueprintIds(@Param("blueprintIds") List<Long> blueprintIds);
}
