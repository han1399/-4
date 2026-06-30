package com.nikki.backend.service;

import com.nikki.backend.entity.Wardrobe;
import com.nikki.backend.mapper.WardrobeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WardrobeService {

    @Autowired
    private WardrobeMapper wardrobeMapper;

    // 获取用户衣柜列表
    public List<Wardrobe> getWardrobeByUserId(Integer userId) {
        return wardrobeMapper.findByUserId(userId);
    }

    // 获取用户某件衣服的数量
    public Wardrobe getByUserIdAndClothingId(Integer userId, Integer clothingId) {
        return wardrobeMapper.findByUserIdAndClothingId(userId, clothingId);
    }
}