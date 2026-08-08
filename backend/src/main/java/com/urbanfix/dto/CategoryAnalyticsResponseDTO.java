package com.urbanfix.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data  //enable getter,setter
@NoArgsConstructor  //Enables default empty contructor, or object ccreattion
@AllArgsConstructor //Enable full parametrized construtor /Object creation
public class CategoryAnalyticsResponseDTO {

    private String category;

    private long complaintCount;

}
