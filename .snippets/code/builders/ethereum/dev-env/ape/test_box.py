def test_store_value(box, owner):
    new_value = 5
    box.store(new_value, sender=owner)
    assert box.retrieve() == new_value