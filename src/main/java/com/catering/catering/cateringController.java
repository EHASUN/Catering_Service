package com.catering.catering;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.catering.catering.dto.CateringDto;
import com.catering.catering.repository.CatererRepo;
import com.catering.catering.service.catering.CatererService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("collection")
public class cateringController {

    @Autowired
    CatererRepo catererRepo;

    @Autowired
    CatererService catererService;


    @RequestMapping("/")  
    public String hello()   
    {  
    return "Hello javaTpoint";  
    } 
    
    @PostMapping("/saveCaterer")
    @ResponseBody
    public Map<Integer, String> saveCaterer(@RequestBody CateringDto cateringDto) {
        Map<Integer, String> result = catererService.saveCaterer(cateringDto);
        return result;
    }
    

    @PostMapping(value = "/getCaterer/{id}/{name}")
    @ResponseBody
    public List<Object[]> getCaterer(@PathVariable("id") String id,@PathVariable("name") String name) {
        return catererService.getCaterer(id,name);
    }
    
    @GetMapping("/cateringList")
    public String cateringList(Model model,@RequestParam("id") String catID
            ,@RequestParam("name") String catName
            ,@RequestParam("cityName") String cityName)
    {
        try{
            List<Object[]> cateringList = catererService.getCatererList(catID,catName,cityName);
            model.addAttribute("cateringList", cateringList);

        }catch(Exception e){
            System.out.println(e.getMessage());
        }
        return "cateringList";

    }
}
