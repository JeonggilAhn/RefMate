package com.dawn.backend.domain.pin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.pin.entity.Pin;

@Repository
public interface PinRepository extends JpaRepository<Pin, Long> {
	Pin findByPinId(Long pinId);
}
