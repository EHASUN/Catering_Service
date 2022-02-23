package com.catering.catering.repository;

import java.util.List;

import com.catering.catering.model.Caterer;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CatererRepo extends MongoRepository<Caterer, String> {

    @Query(value = "select max(id) + 1 from Caterer", nativeQuery = true)
    String getId();
    

@Query(value = "SELECT c.id,c.catererName,c.cateringType,c.foodmenu,c.billAmount,c.vat,\n" +
"  FROM caterer c\n" +
" WHERE c.id = ?1\n" +
"   AND c.catererName = ?2\n" +
"   AND c.cityName = ?3", nativeQuery = true)
List<Object[]> getCatererList(String catID,String catName,String cityName);


@Query(value = "SELECT c.id,c.catererName,c.cateringType,c.foodmenu,c.billAmount,c.vat,\n" +
"  FROM caterer c\n" +
" WHERE\n" +
"   AND c.id = ?1\n" +
"   AND c.catererName = ?2", nativeQuery = true)
List<Object[]> getCaterer(String id,String name);

}