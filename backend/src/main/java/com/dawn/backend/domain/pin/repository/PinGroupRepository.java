package com.dawn.backend.domain.pin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.pin.entity.PinGroup;

@Repository
public interface PinGroupRepository extends JpaRepository<PinGroup, Long> {

	List<PinGroup> findAllByBlueprintBlueprintId(Long blueprintId);
}
