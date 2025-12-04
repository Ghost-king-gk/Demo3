package nuist.ghost.demo3.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("REGULAR_MEMBER") //在数据库member_type列中存储的值
public class RegularMember extends Member {
    public RegularMember() {
        super();
    }

    public RegularMember(String name, String studentID) {
        super(name, studentID);
    }

    @Override
    public String getMemberType() {
        return "普通成员";
    }
}
