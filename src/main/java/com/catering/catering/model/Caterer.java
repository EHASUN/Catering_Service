package com.catering.catering.model;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Document("Caterer")
public class Caterer {

        @Id
        @Column(name = "id")
        private String id;

        public String getId() {
                return id;
        }
        public void setId(String id) {
                this.id = id;
        }

        @Column(name = "catereingType")
        private String catereingType;

        @Column(name = "foodMenu")
        private String foodMenu;

        @Column(name = "country")
        private String country;

        @Column(name = "billDate")
        private Date billDate;

        @Column(name = "billAmount")
        private int billAmount;

        @Column(name = "tax")
        private String tax;


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