package com.urbanfix.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
//"I want to customize how Spring MVC works. by implementing WebMvc
public class WebConfig implements WebMvcConfigurer 
{
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry)
        {       
            //Whenever someone requests like -  http://localhost:5050/uploads/anything
                registry.addResourceHandler("/uploads/**")
                        //Look inside the local folder:
                        .addResourceLocations("file:uploads/");
                
        }
}