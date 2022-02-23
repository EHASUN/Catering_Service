package com.catering.catering.dto;


import java.util.Date;

import lombok.Data;

@Data
public class CateringDto {
        String catereingType;
        String foodMenu;
        String country;
        Date billDate;
        int billAmount;
        String tax;

        public String getCatereingType() {
                return catereingType;
        }
        public String getTax() {
                return tax;
        }
        public void setTax(String tax) {
                this.tax = tax;
        }
        public int getBillAmount() {
                return billAmount;
        }
        public void setBillAmount(int billAmount) {
                this.billAmount = billAmount;
        }
        public Date getBillDate() {
                return billDate;
        }
        public void setBillDate(Date billDate) {
                this.billDate = billDate;
        }
        public String getCountry() {
                return country;
        }
        public void setCountry(String country) {
                this.country = country;
        }
        public String getFoodMenu() {
                return foodMenu;
        }
        public void setFoodMenu(String foodMenu) {
                this.foodMenu = foodMenu;
        }
        public void setCatereingType(String catereingType) {
                this.catereingType = catereingType;
        }

}
