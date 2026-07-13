/*
====================================================
 XENITH AUTOMOTIVE
 Digital Experience Engine
 Philosophy:
 Precision. Motion. Legacy.
====================================================
*/


const Xenith = {

    init(){

        this.header();
        this.reveal();
        this.parallax();
        this.vehicleCards();
        this.loading();

    },


    // HEADER COMPORTADO COMO MARCA PREMIUM

    header(){

        const header =
        document.querySelector(".main-header");


        if(!header) return;


        window.addEventListener("scroll",()=>{

            if(window.scrollY > 80){

                header.classList.add("scrolled");

            }else{

                header.classList.remove("scrolled");

            }

        });

    },



    // REVELAÇÃO CINEMATOGRÁFICA

    reveal(){

        const elements =
        document.querySelectorAll(
        ".model-card, .manifesto-text-block, .section-header"
        );


        const observer =
        new IntersectionObserver(entries=>{


            entries.forEach(entry=>{


                if(entry.isIntersecting){

                    entry.target.classList.add(
                    "xenith-visible"
                    );


                    observer.unobserve(entry.target);

                }


            });


        },
        {
            threshold:.15
        });


        elements.forEach(el=>{

            el.classList.add(
            "xenith-hidden"
            );

            observer.observe(el);

        });


    },



    // MOVIMENTO DE CÂMERA NO HERO

    parallax(){


        const hero =
        document.querySelector(
        ".hero-media-placeholder"
        );


        if(!hero)return;


        window.addEventListener(
        "scroll",
        ()=>{


            const move =
            window.scrollY * 0.18;


            hero.style.transform =
            `
            translateY(${move}px)
            scale(1.05)
            `;


        });


    },



    // INTERAÇÃO DOS MODELOS

    vehicleCards(){

        const cards =
        document.querySelectorAll(
        ".model-card"
        );


        cards.forEach(card=>{


            card.addEventListener(
            "mouseenter",
            ()=>{


                card.style.transform =
                `
                translateY(-15px)
                scale(1.02)
                `;


            });


            card.addEventListener(
            "mouseleave",
            ()=>{


                card.style.transform =
                "";


            });


        });


    },



    // ABERTURA DE MARCA

    loading(){


        window.addEventListener(
        "load",
        ()=>{


            document.body.classList.add(
            "loaded"
            );


        });


    }


};



document.addEventListener(
"DOMContentLoaded",
()=>{

    Xenith.init();

});
