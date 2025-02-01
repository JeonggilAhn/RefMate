package com.dawn.backend.domain.pin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.pin.entity.PinGroup;

@Repository
public interface PinGroupRepository extends JpaRepository<PinGroup, Long> {

}
