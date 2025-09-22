package com.klef.labexam.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klef.labexam.model.Product;

public interface ProductRepository extends JpaRepository<Product, Integer>
{

}
