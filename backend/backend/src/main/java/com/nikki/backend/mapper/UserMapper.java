package com.nikki.backend.mapper;

import com.nikki.backend.entity.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user WHERE username = #{username}")
    User findByUsername(String username);

    @Insert("INSERT INTO user(username, password, gold) VALUES(#{username}, #{password}, #{gold})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Update("UPDATE user SET gold = #{gold} WHERE id = #{id}")
    int updateGold(User user);
}
