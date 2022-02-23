package com.catering.catering.service.catering.servImpl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.server.Session;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;

import com.catering.catering.dto.CateringDto;
import com.catering.catering.model.Caterer;
import com.catering.catering.repository.CatererRepo;
import com.catering.catering.service.catering.CatererService;


@Service
public class CatererServiceImpl implements CatererService {

    @Autowired
    CatererRepo catererRepo;

    @Override
    public Map<Integer, String> saveCaterer(CateringDto cateringDto) {

        Map<Integer, String> map = new HashMap<>();
        Caterer caterer = new Caterer();
        String id = catererRepo.getId();
        try {

            caterer.setId(id);
            caterer.setBillAmount(cateringDto.getBillAmount());
            caterer.setBillDate(cateringDto.getBillDate());
            caterer.setCatereingType(cateringDto.getCatereingType());
            caterer.setFoodMenu(cateringDto.getFoodMenu());

            map.put(1, map.get(1));

            System.out.println("map " + map);


            return map;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return map;
        }


    }

    @Override
    public List<Object[]> getCatererList(String catId,String catName,String cityName) {
        return catererRepo.getCatererList(catId,catName,cityName);
    }

  
    @Override
    public List<Object[]> getCaterer(String id,String name) {
        return catererRepo.getCaterer(id,name);
    }



}