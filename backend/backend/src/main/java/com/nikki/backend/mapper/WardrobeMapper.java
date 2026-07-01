package com.nikki.backend.mapper;

import com.nikki.backend.entity.Wardrobe;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface WardrobeMapper {

    // 根据用户ID查询衣柜所有衣服
    @Select("SELECT * FROM wardrobe WHERE user_id = #{userId}")
    List<Wardrobe> findByUserId(Integer userId);

    // 根据用户ID和服装ID查询某件衣服的数量
    @Select("SELECT * FROM wardrobe WHERE user_id = #{userId} AND clothing_id = #{clothingId}")
    Wardrobe findByUserIdAndClothingId(Integer userId, Integer clothingId);
}
