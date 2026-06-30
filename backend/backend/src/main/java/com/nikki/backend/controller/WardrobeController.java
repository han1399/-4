package com.nikki.backend.controller;

import com.nikki.backend.entity.Wardrobe;
import com.nikki.backend.service.WardrobeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wardrobe")
public class WardrobeController {

    @Autowired
    private WardrobeService wardrobeService;

    // 获取衣柜列表：GET /api/wardrobe/list?userId=1
    @GetMapping("/list")
    public Map<String, Object> list(@RequestParam Integer userId) {
        List<Wardrobe> list = wardrobeService.getWardrobeByUserId(userId);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", list);
        return result;
    }
}
