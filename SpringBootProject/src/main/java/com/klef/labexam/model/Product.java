package com.klef.labexam.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_table")
public class Product {
	@Id
	@Column(name = "pid" , length = 20 , nullable = false)
	int id;
	@Column(name = "pname" , length = 30 , nullable = false)
	String name;
	@Column(name = "pcost" , nullable = false)
	double cost;
	@Column(name = "pcompany" , length = 30 , nullable = false)
	String company;
	@Column(name = "pcontact" , length = 20 , unique = true , nullable = false)
	String contact;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public double getCost() {
		return cost;
	}
	public void setCost(double cost) {
		this.cost = cost;
	}
	public String getCompany() {
		return company;
	}
	public void setCompany(String company) {
		this.company = company;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
	}
	public String toString() {
		return "Product [id=" + id + ", name=" + name + ", cost=" + cost + ", company=" + company + ", contact="
				+ contact + "]";
	}

}
