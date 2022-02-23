package com.catering.catering.service.catering;

import java.util.List;
import java.util.Map;

import com.catering.catering.dto.CateringDto;

public interface CatererService {

    Map<Integer, String> saveCaterer(CateringDto cateringDto);
    List<Object[]> getCatererList(String catId,String catName,String cityName);
    List<Object[]> getCaterer(String id,String name);


}