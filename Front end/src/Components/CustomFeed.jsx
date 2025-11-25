import React, { useState } from 'react';
import FeedPost from './FeedPost';
import PostPage from './PostPage'; 
import '../Styles/CustomFeed.css';

const initialPosts = [
  {
    id: 1,
    subreddit: 'r/hacking',
    time: '19 hr. ago',
    title: 'North Korean operatives running fake job portal targeting US AI firms | CNN Politics',
    content: '', 
    linkDomain: 'cnn.com',
    thumbnail: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTExMVFRUWGBUXFxUVFRUVFRgVFRUWFxUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGy0lICUtKy0rLSstLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAK4BIgMBIgACEQEDEQH/xAAbAAADAQADAQAAAAAAAAAAAAAEBQYDAQIHAP/EAD8QAAEDAwMBBgMGBQIEBwAAAAEAAgMEESEFEjFBBhMiUWFxgZGxFDJCocHRBxUjUuGComKS8PEkM0NywuLy/8QAGgEAAwEBAQEAAAAAAAAAAAAAAgMEAQUABv/EACwRAAICAgIBBAIBAgcAAAAAAAABAhEDIQQSMRMiQVEFYTIjcRQVJEKBseH/2gAMAwEAAhEDEQA/AJSWUluFtQAbTdd46LZhwXaWnNrhTxaToomnJWCTUNiXBC10wDCE3bOCxSuqOBuAmOGxanSE0r8lFaQ7xgoFzVvQybXXTloSy6rp7xW8x/3U4CACXLu/Ub49Epq5dyCe2FHSCzO04AWTGWN0tbMUU2S9gOSso071Ds4TLTKZ7m7xezeULUUL2AXbk2x7qs0ymEFO4v6i6XOX0NhB3sO06e7c9EY6YAKa0uodIqOm0suGSmVSEt27FUkwJsFxNHi60qNOMb/RcVIJbhLjJ9vI7qnDQFQVFn2XfWxuYhqXwuN101OouLArWn2PJpRpiCB+0+yPdWSOFheyCdBlP9LphtzymSaSFRi26ELYHudlN6DTnA3TFsLdyaQMBsLIHksNYmDtNm2KUVpBcq12lbgs39nQ4ZC9GNM9OdolYm4wl9VG6/CtG6M1mEDU0YBRSlRkI2BdnXnghUc0d2qbqqgsOyJhLhYuIF7D0A5PCBZLPvu4vPkLHBPGbXQ2jarQbWxWemenAEJO+V7slpuOTx8wtKat2ryuzW1Q2qKbNwtYAAh4awOWgfc3CzIvo3G/sMMpSqtlKZAXXH8uBF1qTMdIC05tso91VZCSHabLCZ/oUG7DdUM/toXKR7x5r5ED1GepT7nHaiaKlc9qXl1sKh0eYNblZDcj2RdYqiN1+ikiuRwT8kgjpHu816RrsYe0qf0qMbhcI5SaYEIpolKrSXtyQQELHSm9gvR+0MLe6sEj+xhoFhc+iJzoyONvYm/lbmMLnEcdEkc+4XqdN2OqZ4tx2taemSbfopyq7ByNLs8cYP5pC5GNyaTDWGTWkRBamehsHeNceh4KZHslOD0+ao6LQWMaNwubZWzyxrQePDK7Yzmga9ocQN2LLStDJISx1hiyApZM26IevBL224Cmgm2UTkgbSqfuvVV+mVYtlS9TMAFjRVrncKns2SSxq9FHq8zScJYCLJfWF4yu9NMXWQON7Cx+3TMdQoXWLgp58xJsrreCLJLW6a1p3Di/1ToS0DOOxLTOu4Xwqekj3CwHxCBjoGuTjSoRHhetS0Z1cdmp0qwuuKBtpLFOnPuEkrXbHbkUoo9GbLCBo2hYVk4YFN0+u4QOo6uSV5O/AHX7GM1cXO9ELUvCVmuHK7UVSJJWMPDiB169LhJknZVGkqRRaPKyKIPkcGbrnpc3+6T6Wtymr6iMC5cy1uSQPklclHEWAO3EgBoaDg4tYjg/LqvjT08rGsDXbYvujY5uwjnkYPxUraeyiMWgftNtcwSR2OfvD04BKjKuKz8cGxHxAP6r0GqowYiwO3F4AvyfTPXoprUtN2SbQSbAHJueMXwLHjCdhyKqEZsTbsTQyEEZVHSZCRVcLm9E30ma4Cpi7J6ph8rrC6xpdXH3b/BCa1V7W++EngoS7xXN1rkjKbKl4Bys5A3ahaMOAsV80Xwlz/Q2DXyCktXCJ+xr5DsK0d3RnlM6Q4WTXCy6Cay9J1tHklLTOut6kGNsk1HWbclO6mibI3PVTkOmvfMIm/8AQTG01bFpU6RRxvEozwmcFLFEA+QZP3QhIYXQEbmGw+qGrtQ7xxJ5HA9PRKn4Ur0XcbB6k+i/5HcPa58ZsBdvktW9rIZXbZGbb9f8qN37hdAyy5U3+XPkPtFV+1os5E+Jx11k9nodfCANzTdp4KQajKQ0256LTQNUDonROPHF/wAkFPVgAudx9F7DgyRbx5PKIMuePW4uwOgnN/GLed0+oqYPUXBVPkcSOCfyVroLiG5VkMaTI5TbidZtFBukUlIIX+Hgqvqp7BIpGh5JKPI0kDjTbsX1RuEHpziDkWTllHc8Leo00Bt0MYe0OU/cJauoIcCE2hpO9bYpQyLcbHoqbTBhbClpgztuwF1MIwvoBlF6nCRlBsl8kEtTGR3Aa3wkerDdhdq7U9gz8Egk1QucnSdoSlvY2hprYQ+p0HhJHTK0o6klNJQHNylwfTbDmu+kRsF3JpDS2sRgjIPkV3NI3dcLrO8tdtRT3tHoa0x+0vkjLo7GQNJFyBd1upPqtGyVRAtTsbctBP2pshAJG4lojHAv1wlWn1L4wXWuLjHof0TSDWRcjYAT63/JR11tUVJp1bCqmbuo7g5aLj36YScVIddzjcnko9sDqhj2jBe0hu7Gfw3PT/KTyUEkZcx4LXsJDhjB+H1XsUVTPZJNM2naCEFRfeNkTt8KW0dRteb+apgtE2V/IbqNHusfJE0TBay7A7whXS92eUNXoJOlY0kAAugmvsbhdO+dILBbspPgvfoxLVs5+2BfLj+WL5F0B9SIHHUm+Qtpm3ysaqdg4Xxn8CqxQjkh+wZtwYRDWWFinfZGlG58x68ewUtGLtJR2h68+GzeQRwpOfxcsodMXljME0k5v4LvvQ4XFnNJsobtF3feEx4tcG3BKZah2oaYXBmHnFvLzKjZqokgXXL/ABnFyPK3NUl8HUcvRxN/L0g+hN256FdJALldTI78KzBsV9LxeT6k3GqRy+fw1hxqbdtvbO8biDcI6qY2SP16oNGQQbyGj8QIRc6PsTXkl4K7Saf02AULQxUunVIAuklRQOjwUdpz7gLmq07KZNOI8mlDmpM1/itfqnTabwJHM0B916fuPY3Q8pHNAuV9W1TS02SuR52rCV5si9RLRnpt7A2YcfdPdJfwp6xsVzR1bwbeSFLdsJv20ir1QgtKnqJ/isUXSzOdgr6ppLZHKKSvZkNaA9Zpu8bYchJGae4OG4YVLS+q4qWX4QqdugpYqjYu7vYAR5rY1GF9UNwltLTSzzsgiaXPe6wHT3J6NGST0sjnBsXjyJB+mjc8pzUaIX2c0AD+5zgxvP8Ac7CutG7EwQNbuPePsLuzbd12t4A9wT6p1/LIt4cQ64AAs5w6DFgbD4WRxhrYMpbtEJqHZV0VNuyXZL8Ws0gWIF+Ab8+akIKVwd4uAfmvfJ2Nc0hwuCPqFFSdhGX/APPft8tjd3/MCB/tScmBt+0bjzJfyFvZ3TnTm3DRbc7y9B6pv2u09sltzWjADHs3GSwGdzQCSBfydi33eVQaTprIYhEwnF8m1yTyTYBcajTNeC17Q5uORcY4KZixRgqewMuZzdo8r1HQJ4s7e8YBfey5sPNzCA5tuuCB5qfnpgSC0L2IaTZ4LX7Wgg2LQS2wFgw8emQSAbAgJZ2i7HseHTQAtk+86MW2v83NHR3oObea140vAPqN+SApBtFihK6AuKdz0RtcIZsduUrr1dje/ZUZ0cOxq3bLm64qXgBCUstygr5Rk/49WNPtHovkvMoXyPuyL0H9k5p1M+R1zwn1RSANstaSEMFrI58O5t/RZHJLto6DhHrsTUVMHkRA23YRcvZ//wAR3cZw1lyeckn9kNpMwbUNLuASPiqujeA6SY9SAPay5n5Dn58WW4v/AG6/u2NxYouFfv8A6PNdSDo5XNdyMH90HHPm6fdvoNs4d/cPopaJ9j7rq/jp+phU/tA87I3KK+ilpH3C6zCxQumypzp1MJJADwM/mi4j6ZmmWfkGsnETX6BRGdt7G3nY2TPs54pm34AJVfSxQktjPO3AU1WUxp5nWFgQbDyN+nplWZ83qRr9nH4kOkm/0wvtFMwgpZTkAAhCMge913H2HREzt2tXPl7pUh8V1jbHIrBsslJiLnX9UHA8nqj4Hr2RODpmYkpKzSVlmoGxcMJzDZwXzIg1bSYPZxVCXT4nAkORncgHhNKKnDytdS0o2xyilG1ozFOnbFNJIN1k7sC1KIdIcDdHCM8IlGom9lKYsrZQH4XZjsLvPSea7Mo/CoIZW5P9HTyYUoJpiOtqRuIVn/CvTG7pak23ABjfMB2Xm3TgC/uo+qoRvv7K07Hgs7sC/iEn3Rgj8XeHzvst1z7q+E+xysmNxdnoIkvYev6LvG0k3Pw/VLaaYh+ccraIO7zeXgixbtBuAMGwxzcc+pTRYe537rNpuV1e9dInrDQgpZDqzXTGLY8WJ8RHhO2+74Y5R07vCQDYkGx8vVTFFSyRytaLmO4fuJN4yPvsaOCHAnz/AEQyvVBJKnZRvbk2Sau1KWOckOb3bGtc9pIHgJsXDFybkdQAGnlHGe9zwBe5OAOb5P19/JTOtVUE7hsqI9210bgA54Mb9pcCWi98A39UYBprjGMkeMAHxD2cL/UlStY4Odhb/wASdR2uifESWSRlocQ5p3xus7DgD+JqmdDnLsuNyUuStB45VIZVzLNOUnpp7OsqR8AcLFTuq0wiII4SYNeB2VPybGZfJd9rC+RdRNlU1wc26MimbsI6qe7P1G5tjyuayRzZQOhTGkl2R5Scn1MpactkD7YLuVawxf0B81PVsl442Dkub+6rJW2i9gvmPzGRuUf7nVxqopEX/ESLwRu+HzCgnNuML0ft2y9Ow+oXnLTtcuz+DlfHr6bIectphekTXuOqqdPqhG4OPBwVMUeJWkcOwqeDS5ZTtDCPUg2Crk44s/udIrxyWThNfKLHStXjYC51jfg+QSLXdQEjm2O4Am59xwiKLsXj+pLb0FgFlrnZ/wCzs3sfvaCL9SB54QT5vFlcIT38EXGhOE1Ka0LWz2NljqEx24C3awOF0PUEjwlTxyOEkdGXHjlg2noXRVR4TmllG1C0un9fNdHscD6J85eo7IYR9NDykl5XMs4GLpJp05BLfJZzVTu8seOif06oRLbKOgrA3Ko6SqDwo6lN0zpKnakwn7qG5ILraKCocAFNanqrWclddX1kM5Kkqtzqg44VFiKGE2v7nY4TSHV2ltlJQ0Lrol1O9meincYt2O7z60OppL+JeuUVLC23d58DQSGm9m3AueLX3fEHyXjvZyUSTxtcNzd43N8wMn6L1rRdrWPDC5w3uaWkncHMJDrk85+fPWybijSYmUroMqHDpx6nI9LdQpTXu1DqWqYHb+47lz3NjjDju3loc4/hb8QL+6oaqS22/VwHzIH6pF2o0GonO2ExtbLH3Ej3l25rd4eSwAeK/HKaCGO7ZUwEty8CLug47OTM3cwMz4sXPTAPkstZ7RR9y9scskby2Eh7Y95b9od/TbtJA3kAm3QZSvUuxjny1EgczZIxghYSRaRsbIw91gbWa19rX++iafsrIG0rS5rnNmE9QST4u7aGxsbjIAxmyw8D6v2ubE97e/lvE8see63MuLjJyBx8SDg9KZkrhG27g4OFxJazTfI9Bg2+HRTMfYqZ0HcvdGTJVd9OQXZjDT4W3FybucenKsm3YNoHh8rYHoAvI8CQxF7Cxzd4cCCCdoyLOyPdLGaVBDIWF9SSe6O1spteQujb63AY74NTun9Bb04sllQQKonk76XPoGzu+A5PxRxWzGyV/idAx1FSGIPs57ngvc579rosgkk9dh+C890eZzXbV6p2wiAo6Jp/sv8A7GX+q81Y0NnIS35oL9lJDOQPVZTUve8r4kEBEU77KWa6u0WQakhf/I2r5Nu9XyD1GF6URHQUpZJYcJ1Vabezj0W1CwE3Wup1G0KqL/p7JZR/qUgKnp7yRt8nXVNrDtkLz5Aqf0ypHfMv6qn1Wi76J0fG4EXHqvkfykv9THt4/wDTpwVRIvtnITSMPq1efPznyXpHa2l7ulEZzYjPxXnc8W11uhXe/Btek68WyXmr2JnMNf3Tmu5LTdUml9qqiV+2PaPgcfmpeJwHhcPYpt2VeGTWPDsLo8vjxyrtJXRJgyOL6/BVSUkz7b53/wCk2COn057YXbZHOwfvG/REQDoUdAPDZcuOOK+DpSSogdInIdsPHqn81MCEm1qkME928OOEwppXEC+Fb1VWTubvrF6OZCWtQkFY03CYVEd24SiipPGei9FJK2BOTbpGDKgNlPkVxqrgSHBEalA1uUuhbudnhN7KrFdXdDujk8KOo33KZ6Dp7XNGE7j0do6Jahuw55NUeYdsGuu05tn2WnZzLcqo7X0TQwqQ097oncYTk/gTT8jarG04CBrJXW4TON4fa6IdA0pMmlIpgm4C3sdCRKS4OGHkFtr7iLAXdgDOScWuvZez9LugaXEF13nDg65c5xPiDRgk3sRi68501oyGE7rG21212LHB4vYHBx54TKm1QMJt3YPVzoaindf/AInQXYT6jCrx00RydMr9ToXb47NdYOJJwWizHWv8bI5kP6n9FFP7SSEhrZByLbDVz5uDbAYB/qPmmOuaqW0jDmxIMg8IJ3A2LtpI528E9FmRdI2FBqTo5a+SWraTdsLA7ZY/ecMXPwv8gqJjNrSeSV5tQa2WHwSR+YY42+Tj1VxpmqunbZzNhb6gg36ggkH4KbDkvTKc2OtrwMon2K0nkxjn/rKH70N5PwWrnm1w358/4VBMCQtIdY5N+fdKtRjJneG3vvYB6uFJO5ufcjKY00P9RwLmtzcBzgbkjP3gfTgJHqrJBPI6ONri2UDYA5jnbKN5DWuHhuS85IHThHD5BkLe2FUHOpxwBAwgf+7/APIHwUfNStc+6K7d6gftT222iNrIwL9A3df/AHfkl+j1G7lLyOlYUFchtNDZiC0+S5sUylNwlPclklx90qaDvyU5VXgbd0vlyD6rlM6oT3Yq0jW27tpOQjtV1FrhghQeswGOU2POQmeiUbpRuN0Vroep9xmZyNrgbEHCqdO7V2bZ7b26qRqW7ceSIhGPzUmfjYM2FrLG6ejp48U5ZYJeK2Me1uqGqj2MG0dSeVHSQG2x3PIKezR3SbUpLEeiZ+LwxxeyHg38tihDGtbsXzN3N9QuNHqLPb5gj6rdrgSD0PKGrafu3XGOoXUyKzhw+z1ilyAfRGRlIOzdf3sLT1GCnUb1xZx6to60ZdkhP2jgMliBkfop+Svc0hqtnAZuobtGQ2TCfi9wjJHpsc09XcWKAmlLXgNFySlMFabjyTrRpQ6UXR9KYrva0N6Hs06XxyfAdEl16g7mQADBXq1A5uwWSbWtJbJkhG0qoBSd2wDs5IGsFzlUMUwPCjQ0xu2hOdKqb4QqaugpY3XY69oKbcM+6nX0Id0Vbq7btU9C7abFLy6djsNVTFzoO7XzJyU3qog9qS00XiIPnZE6q0ei6dBum4de9jymT2PHiY8D5g/FDmnsLpXX6iWA+i9GXbwLnjoZirLXXcS7aHHnqb5+ZJXcasHM2FpIAIzbaWn8J8wl/Y2ndWTlhvt2kut0FwLj4q+HZNkQsY2yN93B3vgo0pMTJJeCI/lMby3Y8xkkC4aHNz6FU/ZXs9JTyuLnAi3hLS6xvjLCfCR+qOf2fjsSxrhbo43HtflMdMmc4bTi3l5IljVhKbqg8RsZ6n5n/C47y+F8IugFytGw290wAzpoml7nFoJbYAkXte/7/mp9kfeyuBuN00zhY2IDJIYWdL2sx/uCRm6pHuEbCT0DnH4C9/yUjSVPdRGY8RQse7p43xyyux57pY0S8NmP6PMO29d3tdUOvcbg3HHga1ht8WlDaI/KwGnOdl3JyT5k8lOtO0wtCnlK1SGRVPY3pxdZas0Bt1xSyEGyD1qpNreaRFOyuVdDRlTgZXKUAu8lyqLI6JzUqzvHXVHoWrMZHY8qOTHQoC+QDovSSoKEn20Uswvcnrn5rvC7FvJaVIDXkHp+yC7y5JS80UsUV97O1wpt5pS+Ekgl0yV1DQ+9+q3qH4QoKr4OOoN/Zz/zGftlUPoVyRljrdE37kTMt1AQ1XFdE0J2BNm+siPDHvE47K15glMT+DwvQad915tqUFzubzyCq/s3X95G0nkYPuouXhp2P42S/aPKoG1woLtBE8vvYkea9AJvhAx0gc5zSP8AseEnj+WO5EdI88p1XaNQgDcl+uaIYn7mDwk9Oia0bnNYEeS34F4Yr5LDSamwtdMJJwQVG0jn8rd9c5uCvPJ1Wxbxu9HXVSN91tpctjdK6h5ObrSOazUlt/yQ5SVdWUNTVgjlJBl6FbK53msopC0r05Wj0YUxq/Asl7GnfdG0jt5sqGh0ptr2RYk2qMyNRYnAuEh1ynwcK+k00XXaTRmubkBMxxcWBOakhZ/BilsyolPUxsB9rud9Wr0xwDhxZIeyeltgg2sHL3uPl0HHsE2nlt5/uqETmFW8DAQbaYh4I68hFwRXO48fUoiOIDLitMOrWWHn6rkWAuVpk+gWdRHjqfkvHhDrxJikAJvJtjbbm8jhGLe1ypHtRN/QkziSV3kLtEjWRX/007j81U9pItrmMDssbLKLEgh/hiicf9UpNj1apHtRRNETY2uuWzOa1vVsNMHws3E83cXuv1JKJ6xs9H+aEbYRa6Kp3i1kO0ECy7UlM691BHT2V5UmrQQIUBVURcVQQUmMrKraLEJrjqxcJfAnFIvlvZy+SNlNxIF+jO8k77OUGw3KPlmFkPT1oF0+PbJolTUXYPVz7pX+Vz9VldZ/id7n6r66zlfyS/R1fx7rG3+z6QrELueV1cLFdTDHrBI4PJyd8spfs626LTbdtl22rsx2LFR5pdsyidPjY1HjOb/YG6chvsqjsKwSCRo8tw9xZTkkOSOhTv8Ah7UiKZ7T/afqE3leKIOKrbkV7WkjhaQxeMO9Lfst5JQRhcDIXMT6y0dN++Ow2eka9uQkZga0lvRdqjVSwEEH5FLm1Rdmxyn9tCoLZrVaiyLBKE+0CTISzUqMyOBN0y0mjNrAJWSCqwZNqVM6zSADK4oX78BE1VAQchbaVTAO4WY1ftYMk0uyPtuzBQsrgTZOtQp7jhKZ6FwyOiLJga8HoZ78m9C3aQVVUlWLKVhdcI+iJ4ScU3FhzipFEawJZq+viIXRtPREi6ne01KMD1VltKyZRTdF92cr3Ppon7MObuLnO283OBYk+Satlef/AEx6HePpZAUUAiijj6Rta0X82gC58ytJqzZgZceG9fd37JqFsNllt95jfTx//VcCoP8AY3/mP7JTNuAJcbu5t5dRdbU7g4Bx+AutMC5qqX8Pdt92ud9HBBTaxJGfGWP/AOENLPjfcfou8kuVG1lW81BY/bcDcdhJGbBvIHT6pOaTjG0OwxUpUyrdWwVdmuGyQWLb25adw2u62IBsfLhRlVT/ANQi+6waN/8AebXLz5Ekkn1JRTXjnm3A8z0WAkG94vexLb+jfCPol4skpqmFlxqD0K5oLuXLDscPIrtUzhr/AHWFXOHWt0KY4ioyobyS+FKnTZyiaMl+F1rqAtzZYm3EbpM4DWrhCCdfKfqyi4k9WCzSgNOZud6A3PwTWSnLrDGVQUGkMbGTYcH6KrBLrZFkVtEiY2m+c3PVY7B5pZrALZ3AEgbjj3KNdTgjnol5JxclJnV46msbhGjkMXDrpXUVDozg4XMerHqF0Y54NHEyYJRlTHMLcZXE8fqgY9R3YsmUpDgCo4RbyqT+zrzyQ/wzhH4RnmwujNEhPel/Fh9UG2M4zhGfae7bhU8mXVxsg4cO8ZIr6aU7fZERzHCmdJ1AmK/qmkFbgG3OFy57bZ0lS0iq0+lbI27gMLuaCMHok1NqRYz3KHqdVdymdqiiOUX3dDqt0ljuLIqkoWsbdSVJ2gcXWsVUQ1Bcy/omoRJu9ijV6gE2C10uEcpLq195IKZaHVEiyVFXKxspNQoZTgXWU7BtXLvvFYTyq1IkugdsIunWmUPUpbSR3cqSDAUywdZNsc8trQU6zW2UxV0bpaiL+3vGE+wcCfyTypmws6Gxkb7prQCY6nld+HnzPT2HUroxgiBcTd58/qud2f8AJQNfKSQ0WBPUojALUaIPBvOc52jk+l/L3ROkUY2B5fuAxg9W4It7hC6hH3bQxv334Lz0SrRZHw1T6cOO0jc0ctuRfN/TyWGFbfFyo6ib3kk85FvHsHwsf/iFXFxtm3wQVdH/AE22xeRnGOeeEGSPaNDMcusrEcMdhx90Xz5An9khqJi2R4/4nfW6qKlhYHO8nEc+bgB04yoxs7nO3OyTzi3SyXgi8dyY7PJZH1Fuv1bgLhZ6TqBcQHJlWUokFl0pdIa2xRPKpy0J9JwRZaHGLAprVU4e1I9Kl2j2TRtZYI3SMSsWnQx5L5Mft/ovkNoOpH//2Q==', // shortened for readability
    upvotes: 54,
    comments: 1,
    commentsData: [
      { user: 'user1', text: 'Interesting article!' },
      { user: 'user2', text: 'Thanks for sharing.' }
    ]
  },
  {
    id: 2,
    subreddit: 'r/hacking',
    time: '3 hr. ago',
    title: 'Learning more about attacking AI bots and applications',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj7A25pybxjG0l2iHgE1s0hFmTn2fZsIDs2OdbQTSS06T0JdPg5RwgQys1A4ixJckyhSP3HDmh6CRsuzPCNmY2ub1Kd0gGM9Yz7mLKnDOsCQ&s=10',
    content: 'Good day, everyone, I want to learn more about adversarial techniques...',
    upvotes: 2,
    comments: 0,
    commentsData: []
  }
];

function CustomFeed() {
  const [selectedPost, setSelectedPost] = useState(null); // track selected post
  const [mainCommunityJoined, setMainCommunityJoined] = useState(true);
  const [recommendedList, setRecommendedList] = useState([
    { name: 'HowToHack', members: '545,753 members', added: false },
    { name: 'Hacking_Tutorials', members: '397,542 members', added: false },
    { name: 'cybersecurity', members: '1,312,252 members', added: false }
  ]);
  const [activeSort, setActiveSort] = useState('Hot');

  const toggleRecommended = (index) => {
    const newList = [...recommendedList];
    newList[index].added = !newList[index].added;
    setRecommendedList(newList);
  };

  // If a post is selected, show PostPage
  if (selectedPost) {
    return <PostPage post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  // Otherwise, show feed
  return (
    <div className="app-wrapper">
      <div className="content-container">
        {/* HEADER */}
        <div className="page-header">
          <div className="header-left">
            <div className="logo-square">
              <div className="dots"><span></span><span></span><span></span><span></span></div>
            </div>
            <div className="title-group">
              <h1>My custom feed</h1>
              <p>Created by <span className="username">Financial-Tooth-8123</span></p>
            </div>
          </div>
          <div className="header-right">
            <button className="icon-circle share">
              <svg 
  viewBox="0 0 122.88 98.86" 
  width="15" 
  height="16" 
  fill="currentColor"
>
  <path 
    fillRule="evenodd" 
    clipRule="evenodd" 
    d="M122.88,49.43L73.95,98.86V74.23C43.01,67.82,18.56,74.89,0,98.42c3.22-48.4,36.29-71.76,73.95-73.31l0-25.11 L122.88,49.43L122.88,49.43z"
  />
</svg>
            </button>
            <button className="icon-circle">•••</button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="feed-grid">
          {/* LEFT COLUMN: POSTS */}
          <div className="main-feed">
            <div className="sort-controls">
              {['Hot', 'Everywhere', 'New', 'Top'].map(sort => (
                <button 
                  key={sort}
                  className={`sort-btn ${activeSort === sort ? 'active' : ''}`}
                  onClick={() => setActiveSort(sort)}
                >
                  {sort}
                </button>
              ))}
              <span className="view-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 12H5V7h14v10zM7 9h10v2H7zm0 4h10v2H7z"/>
                </svg>
              </span>
            </div>

            {/* POSTS CONTAINER */}
            <div className="posts-container">
              {initialPosts.map((post) => (
                <FeedPost 
                  key={post.id} 
                  post={post} 
                  onClick={() => setSelectedPost(post)} // click handler
                />
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <div className="sidebar">
            {/* ... sidebar code unchanged ... */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomFeed;
